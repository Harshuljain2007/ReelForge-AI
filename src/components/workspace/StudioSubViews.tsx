import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Film,
  Plus,
  ShieldCheck,
  Sparkles,
  Trash2,
} from 'lucide-react';
import React, {useState} from 'react';
import {
  CharacterAsset,
  ReelProject,
  ScenePlan,
  StudioRoute,
  VisualStyle,
} from '../../types/reelforge';
import {ResilientImage} from '../common/ResilientImage';

/* ==========================================================================
   1. SCRIPT EDITOR VIEW
   ========================================================================== */
export const ScriptEditorView: React.FC<{
  project: ReelProject;
  isAuthenticated: boolean;
  onUpdateProject: (updated: ReelProject) => void;
  onSaveProjectToCloud: (project: ReelProject) => Promise<boolean>;
  onNavigate: (route: StudioRoute) => void;
}> = ({
  project,
  isAuthenticated,
  onUpdateProject,
  onSaveProjectToCloud,
  onNavigate,
}) => {
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const handleSceneChange = (
    sceneIndex: number,
    field: keyof ScenePlan,
    value: string | number
  ) => {
    const nextScenes = project.scenes.map((sc, idx) =>
      idx === sceneIndex ? {...sc, [field]: value} : sc
    );
    const nextDuration = nextScenes.reduce(
      (acc, s) => acc + Number(s.duration || 0),
      0
    );
    onUpdateProject({
      ...project,
      scenes: nextScenes,
      durationSeconds: nextDuration,
    });
  };

  const handleAddScene = () => {
    const nextNum = project.scenes.length + 1;
    const newScene: ScenePlan = {
      sceneNumber: nextNum,
      duration: 8,
      narration: '',
      visualDescription: 'Describe visual framing for this scene',
      characterDescription: 'Consistent project host',
      cameraMovement: 'Slow 5% push-in',
      backgroundDescription: 'Studio dark backdrop',
      textOverlays: `Scene 0${nextNum} Overlay`,
      transition: 'Clean cut',
      soundEffect: 'Subtle marker',
      previewImageUrl: project.thumbnailUrl,
    };
    onUpdateProject({
      ...project,
      scenes: [...project.scenes, newScene],
      durationSeconds: project.durationSeconds + 8,
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const ok = await onSaveProjectToCloud(project);
      if (ok) {
        setSavedNotice(
          isAuthenticated && !project.isDemo ? 'Saved to Firestore' : 'Saved Locally'
        );
        window.setTimeout(() => setSavedNotice(null), 2500);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#F4F5F7]">
            Script & Scene Editor
          </h1>
          <p className="mt-1 text-xs text-[#A1A7B3]">
            {project.title} · {project.language} · Total {project.durationSeconds}s
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#1A1E25] hover:bg-[#232832] border border-white/[0.08] text-xs font-medium text-[#F4F5F7] cursor-pointer"
          >
            {savedNotice ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#34D399]" />
                <span>{savedNotice}</span>
              </>
            ) : (
              <span>{saving ? 'Saving...' : 'Save Script'}</span>
            )}
          </button>
          <button
            type="button"
            onClick={() => onNavigate('production')}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B8FF2E] text-[#0B0C0E] text-xs font-semibold hover:bg-[#c8ff59] cursor-pointer"
          >
            <span>Production Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Phase 3 Notice */}
      <div className="rounded-xl bg-[#121418] border border-white/[0.08] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5 text-[#A1A7B3]">
          <Sparkles className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
          <span>
            {project.isDemo
              ? 'Demo sample project. Create a New Reel or save to clone into your Cloud Firestore account.'
              : 'Synced with Cloud Firestore. Automated Gemini regeneration connects in Phase 3.'}
          </span>
        </div>
        <span className="font-mono text-[#6B7280] shrink-0">
          {project.isDemo ? 'Demo Sample' : 'Cloud Project'}
        </span>
      </div>

      {/* Hook & CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-[#121418] border border-white/[0.08] p-5">
          <label
            htmlFor="script-hook"
            className="block text-xs font-medium text-[#A1A7B3] mb-2"
          >
            Opening Hook (First 3 Seconds)
          </label>
          <textarea
            id="script-hook"
            rows={2}
            value={project.hook}
            onChange={(e) => onUpdateProject({...project, hook: e.target.value})}
            className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/[0.08] text-sm text-[#F4F5F7] focus:outline-none focus:border-[#B8FF2E]"
          />
        </div>
        <div className="rounded-xl bg-[#121418] border border-white/[0.08] p-5">
          <label
            htmlFor="script-cta"
            className="block text-xs font-medium text-[#A1A7B3] mb-2"
          >
            Closing Call to Action
          </label>
          <textarea
            id="script-cta"
            rows={2}
            value={project.cta}
            onChange={(e) => onUpdateProject({...project, cta: e.target.value})}
            className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/[0.08] text-sm text-[#F4F5F7] focus:outline-none focus:border-[#B8FF2E]"
          />
        </div>
      </div>

      {/* Scenes Breakdown */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-base font-semibold text-[#F4F5F7]">
            Scene Breakdown ({project.scenes.length} scenes)
          </h2>
          <button
            type="button"
            onClick={handleAddScene}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1A1E25] hover:bg-[#232832] border border-white/[0.08] text-xs font-medium text-[#F4F5F7] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Scene</span>
          </button>
        </div>

        {project.scenes.map((scene, idx) => (
          <div
            key={scene.sceneNumber}
            className="rounded-xl bg-[#121418] border border-white/[0.08] p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-4 pb-3 border-b border-white/[0.06]">
              <span className="font-mono text-xs font-semibold text-[#B8FF2E] tabular-nums">
                Scene 0{scene.sceneNumber}
              </span>
              <div className="flex items-center gap-2 text-xs text-[#A1A7B3]">
                <label htmlFor={`dur-${scene.sceneNumber}`}>Duration (s):</label>
                <input
                  id={`dur-${scene.sceneNumber}`}
                  type="number"
                  min={3}
                  max={30}
                  value={scene.duration}
                  onChange={(e) =>
                    handleSceneChange(idx, 'duration', Number(e.target.value))
                  }
                  className="w-16 px-2 py-1 rounded bg-[#0B0C0E] border border-white/[0.1] font-mono text-xs text-[#F4F5F7] tabular-nums"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-[#A1A7B3] mb-1.5">
                  Narration ({project.language})
                </label>
                <textarea
                  rows={3}
                  value={scene.narration}
                  onChange={(e) =>
                    handleSceneChange(idx, 'narration', e.target.value)
                  }
                  className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/[0.08] text-sm text-[#F4F5F7] focus:outline-none focus:border-[#B8FF2E]"
                />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-[#A1A7B3] mb-1.5">
                    Visual & Background Direction
                  </label>
                  <input
                    type="text"
                    value={scene.visualDescription}
                    onChange={(e) =>
                      handleSceneChange(idx, 'visualDescription', e.target.value)
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/[0.08] text-xs text-[#F4F5F7] focus:outline-none focus:border-[#B8FF2E]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#A1A7B3] mb-1">
                      Text Overlay
                    </label>
                    <input
                      type="text"
                      value={scene.textOverlays}
                      onChange={(e) =>
                        handleSceneChange(idx, 'textOverlays', e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0B0C0E] border border-white/[0.08] text-xs text-[#F4F5F7]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[#A1A7B3] mb-1">
                      Camera Movement
                    </label>
                    <input
                      type="text"
                      value={scene.cameraMovement}
                      onChange={(e) =>
                        handleSceneChange(idx, 'cameraMovement', e.target.value)
                      }
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0B0C0E] border border-white/[0.08] text-xs text-[#F4F5F7]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ==========================================================================
   2. CHARACTER STUDIO VIEW
   ========================================================================== */
export const CharacterStudioView: React.FC<{
  characters: CharacterAsset[];
  isAuthenticated: boolean;
  onAddCharacter: (char: CharacterAsset) => Promise<void>;
  onDeleteCharacter: (characterId: string) => Promise<void>;
}> = ({characters, isAuthenticated, onAddCharacter, onDeleteCharacter}) => {
  const [name, setName] = useState('');
  const [style, setStyle] = useState<VisualStyle>('3D');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim().length < 2) return;
    setSaving(true);
    try {
      await onAddCharacter({
        id: `char-custom-${Date.now()}`,
        name: name.trim(),
        style,
        description:
          description.trim() ||
          `${style} presenter profile awaiting Phase 4 reference generation.`,
        referenceImageUrl: '',
        expressions: ['Neutral', 'Explaining', 'Confident'],
        poses: ['Medium Studio Portrait', 'Three-Quarter View'],
        isDemo: false,
      });
      setName('');
      setDescription('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#F4F5F7]">
          Character Studio
        </h1>
        <p className="mt-1 text-sm text-[#A1A7B3]">
          Manage reusable 2D and 3D character references, expressions, and poses.{' '}
          {isAuthenticated
            ? 'New profiles save directly to Cloud Firestore.'
            : 'Sign in with Google to save custom characters to Cloud Firestore.'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <form
          onSubmit={handleCreate}
          className="lg:col-span-4 rounded-xl bg-[#121418] border border-white/[0.08] p-5 space-y-4 self-start"
        >
          <h2 className="font-display text-base font-semibold text-[#F4F5F7]">
            New Character Profile
          </h2>
          <div>
            <label className="block text-xs text-[#A1A7B3] mb-1.5">
              Character Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Aarav"
              className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/[0.1] text-sm text-[#F4F5F7]"
            />
          </div>
          <div>
            <span className="block text-xs text-[#A1A7B3] mb-1.5">
              Render Style
            </span>
            <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-[#0B0C0E] border border-white/[0.08]">
              {(['3D', '2D'] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  className={`py-1.5 rounded text-xs font-medium cursor-pointer ${
                    style === s ? 'bg-[#20242C] text-[#F4F5F7]' : 'text-[#A1A7B3]'
                  }`}
                >
                  {s} Character
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#A1A7B3] mb-1.5">
              Visual & Wardrobe Spec
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe clothing, lighting, age, and consistent traits..."
              className="w-full px-3 py-2 rounded-lg bg-[#0B0C0E] border border-white/[0.1] text-xs text-[#F4F5F7]"
            />
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 px-4 rounded-lg bg-[#B8FF2E] text-[#0B0C0E] text-xs font-semibold hover:bg-[#c8ff59] disabled:opacity-60 cursor-pointer"
          >
            {saving ? 'Saving...' : 'Save Character Profile'}
          </button>
          <p className="text-[11px] text-[#6B7280]">
            AI reference sheet synthesis activates in Phase 4 with Gemini Image Generation.
          </p>
        </form>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {characters.map((char) => (
            <div
              key={char.id}
              className="rounded-xl bg-[#121418] border border-white/[0.08] overflow-hidden flex flex-col"
            >
              <div className="aspect-[4/3] bg-[#0B0C0E] overflow-hidden">
                <ResilientImage
                  src={char.referenceImageUrl}
                  alt={char.name}
                  fallbackLabel={`${char.name} (${char.style} Spec)`}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-display text-base font-semibold text-[#F4F5F7]">
                      {char.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-[#34D399]">
                        {char.style} · {char.isDemo ? 'Demo' : 'Cloud'}
                      </span>
                      {!char.isDemo && (
                        <button
                          type="button"
                          onClick={() => onDeleteCharacter(char.id)}
                          aria-label={`Delete ${char.name}`}
                          className="p-1 rounded text-[#6B7280] hover:text-rose-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs text-[#A1A7B3] leading-relaxed">
                    {char.description}
                  </p>
                </div>
                <div className="pt-2 border-t border-white/[0.06] text-[11px] text-[#6B7280] space-y-1">
                  <p>Expressions: {char.expressions.join(' · ')}</p>
                  <p>Poses: {char.poses.join(' · ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   3. VIDEO PRODUCTION STUDIO VIEW
   ========================================================================== */
export const ProductionStudioView: React.FC<{
  project: ReelProject;
  onNavigate: (route: StudioRoute) => void;
}> = ({project, onNavigate}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#F4F5F7]">
            Video Production Studio
          </h1>
          <p className="mt-1 text-xs text-[#A1A7B3]">
            Scene-by-scene asset inspection for {project.title}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('timeline')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B8FF2E] text-[#0B0C0E] text-xs font-semibold hover:bg-[#c8ff59] cursor-pointer self-start"
        >
          <span>Open Timeline Editor</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="rounded-xl bg-[#121418] border border-white/[0.08] p-4 flex items-start gap-3 text-xs text-[#A1A7B3]">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Per-scene AI video animation and Google Cloud TTS voiceover generation will connect in Phase 5. Sample projects currently display Demo Content frames.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {project.scenes.map((scene) => (
          <div
            key={scene.sceneNumber}
            className="rounded-xl bg-[#121418] border border-white/[0.08] p-5 flex gap-4"
          >
            <div className="w-24 aspect-[9/16] rounded-lg overflow-hidden bg-[#0B0C0E] shrink-0">
              <ResilientImage
                src={scene.previewImageUrl || project.thumbnailUrl}
                alt={`Scene ${scene.sceneNumber}`}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                  <span className="text-[#B8FF2E]">Scene 0{scene.sceneNumber}</span>
                  <span className="text-[#A1A7B3]">{scene.duration}s</span>
                </div>
                <p className="mt-2 text-xs text-[#F4F5F7] leading-relaxed line-clamp-3">
                  {scene.narration || 'No narration text yet.'}
                </p>
                <p className="mt-2 text-[11px] text-[#A1A7B3] truncate">
                  Camera: {scene.cameraMovement}
                </p>
                <p className="text-[11px] text-[#6B7280] truncate">
                  SFX: {scene.soundEffect}
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between text-[11px] text-[#A1A7B3]">
                <span>{project.isDemo ? 'Demo Asset' : 'Awaiting Phase 4/5'}</span>
                <button
                  type="button"
                  onClick={() => onNavigate('script')}
                  className="text-[#34D399] hover:underline cursor-pointer"
                >
                  Edit Scene
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ==========================================================================
   4. MANUAL TIMELINE EDITOR VIEW
   ========================================================================== */
export const TimelineEditorView: React.FC<{
  project: ReelProject;
  onUpdateProject: (updated: ReelProject) => void;
  onSaveProjectToCloud: (project: ReelProject) => Promise<boolean>;
  onNavigate: (route: StudioRoute) => void;
}> = ({project, onUpdateProject, onSaveProjectToCloud, onNavigate}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [saving, setSaving] = useState(false);
  const activeScene = project.scenes[selectedIndex] || project.scenes[0];

  const moveScene = async (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= project.scenes.length) return;
    const copy = [...project.scenes];
    const [removed] = copy.splice(index, 1);
    copy.splice(target, 0, removed);
    const renumbered = copy.map((sc, i) => ({...sc, sceneNumber: i + 1}));
    const nextProject = {...project, scenes: renumbered};
    onUpdateProject(nextProject);
    setSelectedIndex(target);
    if (!project.isDemo) {
      setSaving(true);
      try {
        await onSaveProjectToCloud(nextProject);
      } finally {
        setSaving(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#F4F5F7]">
            Manual Video Timeline
          </h1>
          <p className="mt-1 text-xs text-[#A1A7B3]">
            {project.title} · 4-track vertical composition ({project.aspectRatio} · {project.resolution})
            {saving ? ' · Syncing order...' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('export')}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#B8FF2E] text-[#0B0C0E] text-xs font-semibold hover:bg-[#c8ff59] cursor-pointer self-start"
        >
          <span>Export Center</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Vertical 9:16 Stage */}
        <div className="lg:col-span-4 rounded-xl bg-[#121418] border border-white/[0.08] p-5 flex flex-col items-center">
          <div className="w-56 aspect-[9/16] rounded-lg overflow-hidden bg-[#0B0C0E] border border-white/[0.1] relative">
            <ResilientImage
              src={activeScene?.previewImageUrl || project.thumbnailUrl}
              alt={`Timeline scene ${activeScene?.sceneNumber}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/30 flex flex-col justify-between p-3">
              <span className="font-mono text-[11px] text-[#E4E7EC] tabular-nums">
                Scene 0{activeScene?.sceneNumber} · {activeScene?.duration}s
              </span>
              <p className="text-xs font-semibold text-[#B8FF2E] bg-black/70 px-2.5 py-1.5 rounded">
                {activeScene?.textOverlays}
              </p>
            </div>
          </div>

          <div className="w-full mt-4 flex items-center justify-between gap-2">
            <button
              type="button"
              disabled={selectedIndex === 0}
              onClick={() => moveScene(selectedIndex, -1)}
              className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-[#1A1E25] disabled:opacity-40 text-xs text-[#F4F5F7] cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Move Earlier</span>
            </button>
            <button
              type="button"
              disabled={selectedIndex === project.scenes.length - 1}
              onClick={() => moveScene(selectedIndex, 1)}
              className="flex-1 inline-flex items-center justify-center gap-1 py-2 px-3 rounded-lg bg-[#1A1E25] disabled:opacity-40 text-xs text-[#F4F5F7] cursor-pointer"
            >
              <span>Move Later</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Multi-Track Timeline Board */}
        <div className="lg:col-span-8 rounded-xl bg-[#121418] border border-white/[0.08] p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#A1A7B3] pb-3 border-b border-white/[0.08]">
            <span>Tracks: Video · Voiceover · Captions · Music</span>
            <span className="font-mono tabular-nums">
              Total: {project.durationSeconds}s @ 30 FPS
            </span>
          </div>

          {/* Track 1: Video Clips */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-[#A1A7B3]">V1 · Video Scenes</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {project.scenes.map((sc, idx) => (
                <button
                  key={sc.sceneNumber}
                  type="button"
                  onClick={() => setSelectedIndex(idx)}
                  className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                    idx === selectedIndex
                      ? 'bg-[#1D2418] border-[#B8FF2E]'
                      : 'bg-[#0B0C0E] border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[11px] tabular-nums">
                    <span className="text-[#F4F5F7]">S0{sc.sceneNumber}</span>
                    <span className="text-[#A1A7B3]">{sc.duration}s</span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#A1A7B3] truncate">
                    {sc.transition}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Track 2: Subtitles */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-[#A1A7B3]">
              T1 · Kinetic Captions ({project.captionStyle})
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {project.scenes.map((sc, idx) => (
                <div
                  key={sc.sceneNumber}
                  onClick={() => setSelectedIndex(idx)}
                  className="p-2 rounded-lg bg-[#0B0C0E] border border-white/[0.06] text-[11px] text-[#34D399] truncate cursor-pointer"
                >
                  {sc.textOverlays}
                </div>
              ))}
            </div>
          </div>

          {/* Track 3 & 4: Voiceover & Music */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-mono text-[#A1A7B3]">
              A1 · Voiceover ({project.language}) & Music ({project.musicTrack})
            </span>
            <div className="p-3 rounded-lg bg-[#0B0C0E] border border-white/[0.06] flex items-center justify-between text-xs text-[#A1A7B3]">
              <span>Synchronized narration track</span>
              <span className="font-mono tabular-nums">
                00:00 — 00:{project.durationSeconds}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#6B7280] pt-2">
            Scene reordering syncs to Cloud Firestore for authenticated projects. Trim/split, drag-and-drop scrubbing, and undo/redo history arrive in Phase 6.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ==========================================================================
   5. EXPORT CENTER VIEW
   ========================================================================== */
export const ExportCenterView: React.FC<{
  project: ReelProject;
}> = ({project}) => {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#F4F5F7]">
          Export Center
        </h1>
        <p className="mt-1 text-sm text-[#A1A7B3]">
          Render specification and watermark-free MP4 delivery for {project.title}
        </p>
      </div>

      <div className="rounded-xl bg-[#121418] border border-white/[0.08] p-6 space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <Film className="w-5 h-5 text-[#B8FF2E]" />
            <div>
              <h2 className="font-display text-base font-semibold text-[#F4F5F7]">
                Vertical Master Output Profile
              </h2>
              <p className="text-xs text-[#A1A7B3]">
                Instagram Reels & YouTube Shorts broadcast parameters
              </p>
            </div>
          </div>
          <span className="font-mono text-xs text-[#34D399]">Watermark-Free</span>
        </div>

        <dl className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg bg-[#0B0C0E] border border-white/[0.06]">
            <dt className="text-[#6B7280]">Resolution</dt>
            <dd className="mt-1 font-mono font-semibold text-[#F4F5F7] tabular-nums">
              1080 × 1920
            </dd>
          </div>
          <div className="p-3 rounded-lg bg-[#0B0C0E] border border-white/[0.06]">
            <dt className="text-[#6B7280]">Frame Rate</dt>
            <dd className="mt-1 font-mono font-semibold text-[#F4F5F7] tabular-nums">
              30 FPS
            </dd>
          </div>
          <div className="p-3 rounded-lg bg-[#0B0C0E] border border-white/[0.06]">
            <dt className="text-[#6B7280]">Container / Codecs</dt>
            <dd className="mt-1 font-mono font-semibold text-[#F4F5F7]">
              MP4 · H.264 / AAC
            </dd>
          </div>
          <div className="p-3 rounded-lg bg-[#0B0C0E] border border-white/[0.06]">
            <dt className="text-[#6B7280]">Duration</dt>
            <dd className="mt-1 font-mono font-semibold text-[#F4F5F7] tabular-nums">
              {project.durationSeconds}s
            </dd>
          </div>
        </dl>

        <div className="rounded-lg bg-[#0B0C0E] border border-white/[0.08] p-4 flex items-start gap-3 text-xs text-[#A1A7B3]">
          <ShieldCheck className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-medium text-[#F4F5F7]">
              Zero Forced Branding & Transparent Render Status
            </p>
            <p className="leading-relaxed">
              ReelForge AI never injects watermarks into exported MP4 files and never simulates completed video renders. Server-side FFmpeg + Remotion rendering will be enabled in Phase 7.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#A1A7B3]">
            Status: Awaiting Phase 7 FFmpeg + Remotion worker
          </span>
          <button
            type="button"
            disabled
            className="px-4 py-2.5 rounded-lg bg-[#1C2026] text-[#6B7280] text-xs font-semibold cursor-not-allowed"
          >
            Render MP4 (Activates Phase 7)
          </button>
        </div>
      </div>
    </div>
  );
};
