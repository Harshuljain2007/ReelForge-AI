import {User} from 'firebase/auth';
import {
  Timestamp,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import {OperationType, db, handleFirestoreError} from '../lib/firebase';
import {
  CharacterAsset,
  DemoSessionUser,
  ReelProject,
  ScenePlan,
} from '../types/reelforge';

export interface FirestoreUsageSummary {
  ownerId: string;
  creditsRemaining: number;
  creditsTotal: number;
  projectsCount: number;
  exportsCount: number;
}

const VALID_ID_REGEX = /^[a-zA-Z0-9_-]+$/;

function sanitizeId(raw: string, fallbackPrefix: string): string {
  const cleaned = raw.replace(/[^a-zA-Z0-9_-]/g, '-').slice(0, 120);
  if (!cleaned || !VALID_ID_REGEX.test(cleaned)) {
    return `${fallbackPrefix}-${Date.now()}`;
  }
  return cleaned;
}

function clampStr(val: string | undefined, maxLen: number, fallback = ''): string {
  const s = (val ?? fallback).trim();
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

function planCredits(plan: DemoSessionUser['plan']): number {
  if (plan === 'Production Team') return 200;
  if (plan === 'Studio Pro') return 60;
  return 20;
}

const ensureInFlight = new Map<string, Promise<void>>();

export async function ensureUserDocuments(
  user: User,
  preferredPlan: DemoSessionUser['plan'] = 'Studio Pro'
): Promise<void> {
  const existingPromise = ensureInFlight.get(user.uid);
  if (existingPromise) return existingPromise;

  const task = (async () => {
    const userRef = doc(db, 'users', user.uid);
    const privateRef = doc(db, 'users', user.uid, 'private', 'account');
    const usageRef = doc(db, 'usage', user.uid);

    try {
      const existingProfile = await getDoc(userRef);
      const displayName = clampStr(
        user.displayName || user.email?.split('@')[0] || 'Creator',
        80,
        'Creator'
      );
      const photoUrl = clampStr(user.photoURL || '', 500, '');

      if (!existingProfile.exists()) {
        const batch = writeBatch(db);
        batch.set(userRef, {
          uid: user.uid,
          displayName,
          photoUrl,
          plan: preferredPlan,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        batch.set(privateRef, {
          uid: user.uid,
          email: clampStr(user.email || 'user@studio.local', 160),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
        const credits = planCredits(preferredPlan);
        batch.set(usageRef, {
          ownerId: user.uid,
          creditsRemaining: credits,
          creditsTotal: credits,
          projectsCount: 0,
          exportsCount: 0,
          updatedAt: serverTimestamp(),
        });
        await batch.commit();
      } else {
        await updateDoc(userRef, {
          displayName,
          photoUrl,
          plan: existingProfile.data().plan || preferredPlan,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    } finally {
      ensureInFlight.delete(user.uid);
    }
  })();

  ensureInFlight.set(user.uid, task);
  return task;
}

export function subscribeToUserProfile(
  uid: string,
  onData: (profile: {
    displayName: string;
    plan: DemoSessionUser['plan'];
    photoUrl: string;
  } | null) => void
): () => void {
  const path = `users/${uid}`;
  return onSnapshot(
    doc(db, 'users', uid),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      const d = snap.data();
      onData({
        displayName: String(d.displayName || 'Creator'),
        plan: (d.plan as DemoSessionUser['plan']) || 'Studio Pro',
        photoUrl: String(d.photoUrl || ''),
      });
    },
    (error) => handleFirestoreError(error, OperationType.GET, path)
  );
}

export function subscribeToUsageSummary(
  uid: string,
  onData: (usage: FirestoreUsageSummary | null) => void
): () => void {
  const path = `usage/${uid}`;
  return onSnapshot(
    doc(db, 'usage', uid),
    (snap) => {
      if (!snap.exists()) {
        onData(null);
        return;
      }
      const d = snap.data();
      onData({
        ownerId: String(d.ownerId),
        creditsRemaining: Number(d.creditsRemaining ?? 0),
        creditsTotal: Number(d.creditsTotal ?? 60),
        projectsCount: Number(d.projectsCount ?? 0),
        exportsCount: Number(d.exportsCount ?? 0),
      });
    },
    (error) => handleFirestoreError(error, OperationType.GET, path)
  );
}

function formatUpdatedAt(ts: unknown): string {
  if (ts instanceof Timestamp) {
    return ts.toDate().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    });
  }
  return 'Synced';
}

export function subscribeToUserProjects(
  uid: string,
  onData: (projects: ReelProject[]) => void
): () => void {
  const path = 'projects';
  const q = query(collection(db, 'projects'), where('ownerId', '==', uid));
  return onSnapshot(
    q,
    (snap) => {
      const items: Array<{project: ReelProject; sortMs: number}> = snap.docs.map(
        (docSnap) => {
          const d = docSnap.data();
          const updatedTs = d.updatedAt as Timestamp | undefined;
          const sortMs = updatedTs instanceof Timestamp ? updatedTs.toMillis() : 0;
          return {
            sortMs,
            project: {
              id: docSnap.id,
              title: String(d.title || 'Untitled Reel'),
              topic: String(d.topic || ''),
              mode: d.mode === 'studio' ? 'studio' : 'auto',
              language: d.language || 'Hinglish',
              tone: d.tone || 'Conversational',
              durationSeconds: Number(d.durationSeconds || 45),
              visualStyle: d.visualStyle === '2D' ? '2D' : '3D',
              characterId: String(d.characterId || ''),
              voiceId: String(d.voiceId || 'voice-hinglish-arjun'),
              aspectRatio: '9:16',
              resolution: '1080p',
              musicTrack: String(d.musicTrack || 'No Background Music'),
              captionStyle: d.captionStyle || 'Bold Kinetic',
              status: d.status || 'Draft',
              updatedAt: formatUpdatedAt(d.updatedAt),
              thumbnailUrl: String(d.thumbnailUrl || ''),
              hook: String(d.hook || ''),
              cta: String(d.cta || ''),
              scenes: [],
              isDemo: false,
            },
          };
        }
      );
      items.sort((a, b) => b.sortMs - a.sortMs);
      onData(items.map((x) => x.project));
    },
    (error) => handleFirestoreError(error, OperationType.LIST, path)
  );
}

export function subscribeToProjectScenes(
  projectId: string,
  uid: string,
  onData: (scenes: ScenePlan[]) => void
): () => void {
  const path = `projects/${projectId}/scenes`;
  const q = query(
    collection(db, 'projects', projectId, 'scenes'),
    where('ownerId', '==', uid)
  );
  return onSnapshot(
    q,
    (snap) => {
      const list: ScenePlan[] = snap.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          sceneNumber: Number(d.sceneNumber || 1),
          duration: Number(d.duration || 8),
          narration: String(d.narration || ''),
          visualDescription: String(d.visualDescription || ''),
          characterDescription: String(d.characterDescription || ''),
          cameraMovement: String(d.cameraMovement || ''),
          backgroundDescription: String(d.backgroundDescription || ''),
          textOverlays: String(d.textOverlays || ''),
          transition: String(d.transition || ''),
          soundEffect: String(d.soundEffect || ''),
          previewImageUrl: String(d.previewImageUrl || ''),
        };
      });
      list.sort((a, b) => a.sceneNumber - b.sceneNumber);
      onData(list);
    },
    (error) => handleFirestoreError(error, OperationType.LIST, path)
  );
}

export async function createProjectWithScenes(
  uid: string,
  draft: ReelProject,
  currentProjectsCount: number
): Promise<string> {
  const projectId = sanitizeId(draft.id, 'proj');
  const projectPath = `projects/${projectId}`;
  try {
    const batch = writeBatch(db);
    batch.set(doc(db, 'projects', projectId), {
      id: projectId,
      ownerId: uid,
      title: clampStr(draft.title, 140, 'Untitled Reel'),
      topic: clampStr(draft.topic, 600, 'Vertical reel'),
      mode: draft.mode,
      language: draft.language,
      tone: draft.tone,
      durationSeconds: Math.min(180, Math.max(5, Number(draft.durationSeconds) || 45)),
      visualStyle: draft.visualStyle,
      characterId: clampStr(draft.characterId, 128, ''),
      voiceId: clampStr(draft.voiceId, 128, 'voice-hinglish-arjun'),
      aspectRatio: '9:16',
      resolution: '1080p',
      musicTrack: clampStr(draft.musicTrack, 120, 'No Background Music'),
      captionStyle: draft.captionStyle,
      status: draft.status === 'Demo Ready' ? 'Draft' : draft.status,
      thumbnailUrl: clampStr(draft.thumbnailUrl, 500, ''),
      hook: clampStr(draft.hook, 500, ''),
      cta: clampStr(draft.cta, 500, ''),
      sceneCount: draft.scenes.length,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    draft.scenes.slice(0, 30).forEach((sc, idx) => {
      const sceneId = `scene-${idx + 1}`;
      batch.set(doc(db, 'projects', projectId, 'scenes', sceneId), {
        id: sceneId,
        projectId,
        ownerId: uid,
        sceneNumber: idx + 1,
        duration: Math.min(60, Math.max(1, Number(sc.duration) || 8)),
        narration: clampStr(sc.narration, 1200, ''),
        visualDescription: clampStr(sc.visualDescription, 600, ''),
        characterDescription: clampStr(sc.characterDescription, 400, ''),
        cameraMovement: clampStr(sc.cameraMovement, 200, ''),
        backgroundDescription: clampStr(sc.backgroundDescription, 400, ''),
        textOverlays: clampStr(sc.textOverlays, 200, ''),
        transition: clampStr(sc.transition, 120, ''),
        soundEffect: clampStr(sc.soundEffect, 200, ''),
        previewImageUrl: clampStr(sc.previewImageUrl, 500, ''),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    });

    batch.update(doc(db, 'usage', uid), {
      projectsCount: Math.min(10000, currentProjectsCount + 1),
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
    return projectId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, projectPath);
  }
}

export async function updateProjectWithScenes(
  uid: string,
  project: ReelProject
): Promise<void> {
  const projectId = sanitizeId(project.id, 'proj');
  const projectPath = `projects/${projectId}`;
  try {
    await updateDoc(doc(db, 'projects', projectId), {
      title: clampStr(project.title, 140, 'Untitled Reel'),
      topic: clampStr(project.topic, 600, 'Vertical reel'),
      mode: project.mode,
      language: project.language,
      tone: project.tone,
      durationSeconds: Math.min(180, Math.max(5, Number(project.durationSeconds) || 45)),
      visualStyle: project.visualStyle,
      characterId: clampStr(project.characterId, 128, ''),
      voiceId: clampStr(project.voiceId, 128, 'voice-hinglish-arjun'),
      musicTrack: clampStr(project.musicTrack, 120, 'No Background Music'),
      captionStyle: project.captionStyle,
      status: project.status,
      thumbnailUrl: clampStr(project.thumbnailUrl, 500, ''),
      hook: clampStr(project.hook, 500, ''),
      cta: clampStr(project.cta, 500, ''),
      sceneCount: project.scenes.length,
      updatedAt: serverTimestamp(),
    });

    for (let idx = 0; idx < Math.min(project.scenes.length, 30); idx++) {
      const sc = project.scenes[idx];
      const sceneId = `scene-${idx + 1}`;
      const sceneRef = doc(db, 'projects', projectId, 'scenes', sceneId);
      const existingSnap = await getDoc(sceneRef);
      if (existingSnap.exists()) {
        await updateDoc(sceneRef, {
          sceneNumber: idx + 1,
          duration: Math.min(60, Math.max(1, Number(sc.duration) || 8)),
          narration: clampStr(sc.narration, 1200, ''),
          visualDescription: clampStr(sc.visualDescription, 600, ''),
          characterDescription: clampStr(sc.characterDescription, 400, ''),
          cameraMovement: clampStr(sc.cameraMovement, 200, ''),
          backgroundDescription: clampStr(sc.backgroundDescription, 400, ''),
          textOverlays: clampStr(sc.textOverlays, 200, ''),
          transition: clampStr(sc.transition, 120, ''),
          soundEffect: clampStr(sc.soundEffect, 200, ''),
          previewImageUrl: clampStr(sc.previewImageUrl, 500, ''),
          updatedAt: serverTimestamp(),
        });
      } else {
        await setDoc(sceneRef, {
          id: sceneId,
          projectId,
          ownerId: uid,
          sceneNumber: idx + 1,
          duration: Math.min(60, Math.max(1, Number(sc.duration) || 8)),
          narration: clampStr(sc.narration, 1200, ''),
          visualDescription: clampStr(sc.visualDescription, 600, ''),
          characterDescription: clampStr(sc.characterDescription, 400, ''),
          cameraMovement: clampStr(sc.cameraMovement, 200, ''),
          backgroundDescription: clampStr(sc.backgroundDescription, 400, ''),
          textOverlays: clampStr(sc.textOverlays, 200, ''),
          transition: clampStr(sc.transition, 120, ''),
          soundEffect: clampStr(sc.soundEffect, 200, ''),
          previewImageUrl: clampStr(sc.previewImageUrl, 500, ''),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, projectPath);
  }
}

export async function deleteProjectWithScenes(
  uid: string,
  projectId: string
): Promise<void> {
  const path = `projects/${projectId}`;
  try {
    const scenesSnap = await getDocs(
      query(
        collection(db, 'projects', projectId, 'scenes'),
        where('ownerId', '==', uid)
      )
    );
    const batch = writeBatch(db);
    scenesSnap.docs.forEach((sc) => batch.delete(sc.ref));
    batch.delete(doc(db, 'projects', projectId));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export function subscribeToUserCharacters(
  uid: string,
  onData: (characters: CharacterAsset[]) => void
): () => void {
  const path = 'characters';
  const q = query(collection(db, 'characters'), where('ownerId', '==', uid));
  return onSnapshot(
    q,
    (snap) => {
      const items: CharacterAsset[] = snap.docs.map((docSnap) => {
        const d = docSnap.data();
        return {
          id: docSnap.id,
          name: String(d.name || 'Unnamed'),
          style: d.style === '2D' ? '2D' : '3D',
          description: String(d.description || ''),
          referenceImageUrl: String(d.referenceImageUrl || ''),
          expressions: Array.isArray(d.expressions)
            ? d.expressions.map(String)
            : ['Neutral'],
          poses: Array.isArray(d.poses)
            ? d.poses.map(String)
            : ['Studio Portrait'],
          isDemo: false,
        };
      });
      onData(items);
    },
    (error) => handleFirestoreError(error, OperationType.LIST, path)
  );
}

export async function createCharacterProfile(
  uid: string,
  char: CharacterAsset
): Promise<string> {
  const characterId = sanitizeId(char.id, 'char');
  const path = `characters/${characterId}`;
  try {
    await setDoc(doc(db, 'characters', characterId), {
      id: characterId,
      ownerId: uid,
      name: clampStr(char.name, 80, 'Character'),
      style: char.style,
      description: clampStr(char.description, 600, ''),
      referenceImageUrl: clampStr(char.referenceImageUrl, 500, ''),
      expressions:
        char.expressions.length > 0 ? char.expressions.slice(0, 12) : ['Neutral'],
      poses: char.poses.length > 0 ? char.poses.slice(0, 12) : ['Studio Portrait'],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return characterId;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

export async function deleteCharacterProfile(characterId: string): Promise<void> {
  const path = `characters/${characterId}`;
  try {
    await deleteDoc(doc(db, 'characters', characterId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
