/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {User, onAuthStateChanged, signOut} from 'firebase/auth';
import React, {useEffect, useMemo, useState} from 'react';
import {AuthModal} from './components/auth/AuthModal';
import {LandingPage} from './components/landing/LandingPage';
import {WorkspaceShell} from './components/workspace/WorkspaceShell';
import {
  DEFAULT_DEMO_USER,
  DEMO_CHARACTERS,
  DEMO_PROJECTS,
} from './data/demoStudioData';
import {auth} from './lib/firebase';
import {
  FirestoreUsageSummary,
  createCharacterProfile,
  createProjectWithScenes,
  deleteCharacterProfile,
  deleteProjectWithScenes,
  ensureUserDocuments,
  subscribeToProjectScenes,
  subscribeToUsageSummary,
  subscribeToUserCharacters,
  subscribeToUserProfile,
  subscribeToUserProjects,
  updateProjectWithScenes,
} from './services/firestoreService';
import {fetchProviderCapabilities} from './services/providerAdapters';
import {
  CapabilitiesResponse,
  CharacterAsset,
  DemoSessionUser,
  ReelProject,
  ScenePlan,
  StudioRoute,
} from './types/reelforge';

export default function App() {
  const [surface, setSurface] = useState<'landing' | 'workspace'>('landing');
  const [studioRoute, setStudioRoute] = useState<StudioRoute>('dashboard');

  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [cloudProfile, setCloudProfile] = useState<{
    displayName: string;
    plan: DemoSessionUser['plan'];
    photoUrl: string;
  } | null>(null);
  const [cloudUsage, setCloudUsage] = useState<FirestoreUsageSummary | null>(
    null
  );
  const [cloudProjects, setCloudProjects] = useState<ReelProject[]>([]);
  const [cloudCharacters, setCloudCharacters] = useState<CharacterAsset[]>([]);
  const [activeProjectScenes, setActiveProjectScenes] = useState<ScenePlan[]>(
    []
  );

  // Local Demo Mode fallback state when not signed in
  const [localDraftProjects, setLocalDraftProjects] =
    useState<ReelProject[]>(DEMO_PROJECTS);
  const [localCharacters, setLocalCharacters] =
    useState<CharacterAsset[]>(DEMO_CHARACTERS);

  const [activeProjectId, setActiveProjectId] = useState<string>(
    DEMO_PROJECTS[0].id
  );
  const [syncError, setSyncError] = useState<string | null>(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authPlan, setAuthPlan] =
    useState<DemoSessionUser['plan']>('Studio Pro');

  const [capabilities, setCapabilities] = useState<CapabilitiesResponse>({
    phase: 2,
    demoModeActive: true,
    providers: [],
  });

  useEffect(() => {
    fetchProviderCapabilities().then(setCapabilities);
  }, []);

  // Subscribe to Firebase Auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      setAuthReady(true);
      if (user) {
        try {
          await ensureUserDocuments(user, authPlan);
        } catch (err) {
          setSyncError(
            err instanceof Error ? err.message : 'Failed to initialize profile.'
          );
        }
      } else {
        setCloudProfile(null);
        setCloudUsage(null);
        setCloudProjects([]);
        setCloudCharacters([]);
        setActiveProjectScenes([]);
      }
    });
    return () => unsub();
  }, [authPlan]);

  // Attach Firestore real-time listeners ONLY when authenticated & authReady
  useEffect(() => {
    if (!authReady || !firebaseUser) return;
    const uid = firebaseUser.uid;

    const unsubProfile = subscribeToUserProfile(uid, setCloudProfile);
    const unsubUsage = subscribeToUsageSummary(uid, setCloudUsage);
    const unsubProjects = subscribeToUserProjects(uid, (items) => {
      setCloudProjects(items);
    });
    const unsubChars = subscribeToUserCharacters(uid, setCloudCharacters);

    return () => {
      unsubProfile();
      unsubUsage();
      unsubProjects();
      unsubChars();
    };
  }, [authReady, firebaseUser]);

  // Subscribe to scenes for the currently active Cloud Firestore project
  useEffect(() => {
    if (!authReady || !firebaseUser) return;
    const isCloudProject = cloudProjects.some((p) => p.id === activeProjectId);
    if (!isCloudProject) {
      setActiveProjectScenes([]);
      return;
    }

    const unsubScenes = subscribeToProjectScenes(
      activeProjectId,
      firebaseUser.uid,
      setActiveProjectScenes
    );
    return () => unsubScenes();
  }, [authReady, firebaseUser, activeProjectId, cloudProjects]);

  const user: DemoSessionUser = useMemo(() => {
    if (!firebaseUser) {
      return DEFAULT_DEMO_USER;
    }
    return {
      uid: firebaseUser.uid,
      name:
        cloudProfile?.displayName ||
        firebaseUser.displayName ||
        firebaseUser.email?.split('@')[0] ||
        'Creator',
      email: firebaseUser.email || '',
      photoUrl: cloudProfile?.photoUrl || firebaseUser.photoURL || '',
      plan: cloudProfile?.plan || authPlan,
      creditsRemaining: cloudUsage?.creditsRemaining ?? 60,
      creditsTotal: cloudUsage?.creditsTotal ?? 60,
      isDemoSession: false,
    };
  }, [firebaseUser, cloudProfile, cloudUsage, authPlan]);

  // Combine Cloud Firestore projects (first) with read-only Demo reference reels
  const projects: ReelProject[] = useMemo(() => {
    if (!firebaseUser) return localDraftProjects;
    const hydratedCloud = cloudProjects.map((proj) =>
      proj.id === activeProjectId && activeProjectScenes.length > 0
        ? {...proj, scenes: activeProjectScenes}
        : proj
    );
    return [...hydratedCloud, ...DEMO_PROJECTS];
  }, [
    firebaseUser,
    localDraftProjects,
    cloudProjects,
    activeProjectId,
    activeProjectScenes,
  ]);

  const characters: CharacterAsset[] = useMemo(() => {
    if (!firebaseUser) return localCharacters;
    return [...cloudCharacters, ...DEMO_CHARACTERS];
  }, [firebaseUser, localCharacters, cloudCharacters]);

  const handleEnterStudio = (projectId?: string) => {
    if (projectId) {
      setActiveProjectId(projectId);
      setStudioRoute('script');
    } else {
      setStudioRoute('dashboard');
    }
    setSurface('workspace');
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  const handleOpenAuth = (
    mode: 'signin' | 'signup',
    plan: DemoSessionUser['plan'] = 'Studio Pro'
  ) => {
    setAuthMode(mode);
    setAuthPlan(plan);
    setAuthModalOpen(true);
  };

  const handleAuthenticated = (plan: DemoSessionUser['plan']) => {
    setAuthPlan(plan);
    setAuthModalOpen(false);
    setSurface('workspace');
    setStudioRoute('dashboard');
  };

  const handleContinueDemo = () => {
    setAuthModalOpen(false);
    setSurface('workspace');
    setStudioRoute('dashboard');
  };

  const handleSignOut = async () => {
    await signOut(auth);
    setActiveProjectId(DEMO_PROJECTS[0].id);
    setStudioRoute('dashboard');
  };

  const handleSelectProject = (projectId: string, targetRoute?: StudioRoute) => {
    setActiveProjectId(projectId);
    if (targetRoute) {
      setStudioRoute(targetRoute);
    }
  };

  const handleCreateProjectDraft = async (draft: ReelProject) => {
    setSyncError(null);
    if (firebaseUser) {
      try {
        const newId = await createProjectWithScenes(
          firebaseUser.uid,
          draft,
          cloudUsage?.projectsCount ?? cloudProjects.length
        );
        setActiveProjectId(newId);
        setStudioRoute('script');
      } catch (err) {
        setSyncError(
          err instanceof Error
            ? err.message
            : 'Unable to save project to Cloud Firestore.'
        );
      }
      return;
    }

    setLocalDraftProjects((prev) => [draft, ...prev]);
    setActiveProjectId(draft.id);
    setStudioRoute('script');
  };

  const handleUpdateProject = (updated: ReelProject) => {
    if (!firebaseUser || updated.isDemo) {
      setLocalDraftProjects((prev) =>
        prev.map((p) => (p.id === updated.id ? updated : p))
      );
      return;
    }
    setActiveProjectScenes(updated.scenes);
    setCloudProjects((prev) =>
      prev.map((p) => (p.id === updated.id ? updated : p))
    );
  };

  const handleSaveProjectToCloud = async (
    project: ReelProject
  ): Promise<boolean> => {
    setSyncError(null);
    if (!firebaseUser) {
      setAuthModalOpen(true);
      return false;
    }

    try {
      if (project.isDemo) {
        const cloned: ReelProject = {
          ...project,
          id: `reel-${Date.now()}`,
          title: `${project.title} (Copy)`,
          status: 'Draft',
          isDemo: false,
        };
        const newId = await createProjectWithScenes(
          firebaseUser.uid,
          cloned,
          cloudUsage?.projectsCount ?? cloudProjects.length
        );
        setActiveProjectId(newId);
      } else {
        await updateProjectWithScenes(firebaseUser.uid, project);
      }
      return true;
    } catch (err) {
      setSyncError(
        err instanceof Error ? err.message : 'Failed to save changes to Firestore.'
      );
      return false;
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    setSyncError(null);
    if (!firebaseUser) return;
    try {
      await deleteProjectWithScenes(firebaseUser.uid, projectId);
      if (activeProjectId === projectId) {
        setActiveProjectId(DEMO_PROJECTS[0].id);
      }
    } catch (err) {
      setSyncError(
        err instanceof Error ? err.message : 'Failed to delete project.'
      );
    }
  };

  const handleAddCharacter = async (char: CharacterAsset) => {
    setSyncError(null);
    if (firebaseUser) {
      try {
        await createCharacterProfile(firebaseUser.uid, char);
      } catch (err) {
        setSyncError(
          err instanceof Error ? err.message : 'Failed to save character.'
        );
      }
      return;
    }
    setLocalCharacters((prev) => [char, ...prev]);
  };

  const handleDeleteCharacter = async (characterId: string) => {
    setSyncError(null);
    if (!firebaseUser) return;
    try {
      await deleteCharacterProfile(characterId);
    } catch (err) {
      setSyncError(
        err instanceof Error ? err.message : 'Failed to delete character.'
      );
    }
  };

  return (
    <>
      {surface === 'landing' ? (
        <LandingPage
          onEnterStudio={handleEnterStudio}
          onOpenAuth={handleOpenAuth}
        />
      ) : (
        <WorkspaceShell
          user={user}
          activeRoute={studioRoute}
          projects={projects}
          activeProjectId={activeProjectId}
          characters={characters}
          capabilities={capabilities}
          syncError={syncError}
          onDismissSyncError={() => setSyncError(null)}
          onNavigate={setStudioRoute}
          onSelectProject={handleSelectProject}
          onCreateProjectDraft={handleCreateProjectDraft}
          onUpdateProject={handleUpdateProject}
          onSaveProjectToCloud={handleSaveProjectToCloud}
          onDeleteProject={handleDeleteProject}
          onAddCharacter={handleAddCharacter}
          onDeleteCharacter={handleDeleteCharacter}
          onBackToLanding={() => setSurface('landing')}
          onOpenAuth={() => handleOpenAuth('signin', user.plan)}
          onSignOut={handleSignOut}
        />
      )}

      <AuthModal
        isOpen={authModalOpen}
        initialMode={authMode}
        preselectedPlan={authPlan}
        onClose={() => setAuthModalOpen(false)}
        onAuthenticated={handleAuthenticated}
        onContinueDemo={handleContinueDemo}
      />
    </>
  );
}
