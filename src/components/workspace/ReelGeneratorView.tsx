import {ArrowRight, Info} from 'lucide-react';
import React, {useState} from 'react';
import {DEMO_MUSIC_TRACKS, DEMO_VOICES} from '../../data/demoStudioData';
import {
  CaptionStyle,
  CharacterAsset,
  ProductionMode,
  ReelProject,
  ScriptLanguage,
  ScriptTone,
  VisualStyle,
} from '../../types/reelforge';

interface ReelGeneratorViewProps {
  characters: CharacterAsset[];
  onCreateProjectDraft: (project: ReelProject) => Promise<void>;
}

const TONES: ScriptTone[] = [
  'Conversational',
  'Documentary',
  'Educational',
  'High-Energy',
  'Editorial',
];

const CAPTION_STYLES: CaptionStyle[] = [
  'Bold Kinetic',
  'Minimal Lower Third',
  'Word Highlight',
  'Clean Editorial',
];

export const ReelGeneratorView: React.FC<ReelGeneratorViewProps> = ({
  characters,
  onCreateProjectDraft,
}) => {
  const [topic, setTopic] = useState('');
  const [mode, setMode] = useState<ProductionMode>('auto');
  const [language, setLanguage] = useState<ScriptLanguage>('Hinglish');
  const [tone, setTone] = useState<ScriptTone>('Conversational');
  const [durationSeconds, setDurationSeconds] = useState(45);
  const [visualStyle, setVisualStyle] = useState<VisualStyle>('3D');
  const [characterId, setCharacterId] = useState(characters[0]?.id || '');
  const [voiceId, setVoiceId] = useState(DEMO_VOICES[0].id);
  const [musicTrack, setMusicTrack] = useState(DEMO_MUSIC_TRACKS[0]);
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>('Bold Kinetic');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = topic.trim();
    if (cleaned.length < 6) {
      setError('Enter a topic or idea of at least 6 characters to create a Reel brief.');
      return;
    }
    setError(null);

    const selectedCharacter =
      characters.find((c) => c.id === characterId) || characters[0];

    const sceneCount = durationSeconds <= 35 ? 3 : 4;
    const perScene = Math.round(durationSeconds / sceneCount);

    const draftProject: ReelProject = {
      id: `draft-${Date.now()}`,
      title: cleaned.length > 62 ? `${cleaned.slice(0, 62)}...` : cleaned,
      topic: cleaned,
      mode,
      language,
      tone,
      durationSeconds,
      visualStyle,
      characterId: selectedCharacter?.id || '',
      voiceId,
      aspectRatio: '9:16',
      resolution: '1080p',
      musicTrack,
      captionStyle,
      status: 'Draft',
      updatedAt: 'Local Draft · Phase 1',
      thumbnailUrl: selectedCharacter?.referenceImageUrl || '',
      hook: `Draft hook pending Gemini Script Engine (Phase 3) for: "${cleaned}"`,
      cta: 'Draft CTA — edit in Script Editor or connect Gemini API in Phase 3.',
      isDemo: false,
      scenes: Array.from({length: sceneCount}).map((_, idx) => ({
        sceneNumber: idx + 1,
        duration:
          idx === sceneCount - 1
            ? Math.max(5, durationSeconds - perScene * (sceneCount - 1))
            : perScene,
        narration: `Scene ${idx + 1} narration placeholder (${language} · ${tone}). Connect Gemini API in Phase 3 or write your custom line here.`,
        visualDescription: `${visualStyle} scene framing featuring ${selectedCharacter?.name || 'selected character'}`,
        characterDescription: selectedCharacter?.description || 'Primary host',
        cameraMovement: idx === 0 ? 'Slow 5% push-in' : 'Medium locked framing',
        backgroundDescription: 'Clean studio environment matching brief tone',
        textOverlays: idx === 0 ? cleaned.slice(0, 38) : `Scene 0${idx + 1} Key Point`,
        transition: 'Clean cut',
        soundEffect: 'Subtle transition marker',
        previewImageUrl: selectedCharacter?.referenceImageUrl,
      })),
    };

    setSubmitting(true);
    try {
      await onCreateProjectDraft(draftProject);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-[#F4F5F7]">
          AI Reel Generator
        </h1>
        <p className="mt-1 text-sm text-[#A1A7B3]">
          Configure a 30–60 second vertical 9:16 brief. Creating a brief saves a structured draft in your workspace and opens the Script Editor.
        </p>
      </div>

      <div className="rounded-xl bg-[#121418] border border-white/[0.08] p-4 flex items-start gap-3 text-xs text-[#A1A7B3]">
        <Info className="w-4 h-4 text-[#B8FF2E] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          Phase 1 creates an editable structured project brief without inventing fake AI outputs. Automated Gemini script writing and scene planning activate in Phase 3.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-[#121418] border border-white/[0.08] p-6 space-y-6"
      >
        <div>
          <label
            htmlFor="reel-topic"
            className="block text-xs font-medium text-[#E4E7EC] mb-2"
          >
            Topic or Video Idea
          </label>
          <textarea
            id="reel-topic"
            rows={3}
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., 3 subtle UX mistakes slowing down SaaS onboarding, explained in Hinglish with a 3D host"
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C0E] border border-white/[0.1] text-sm text-[#F4F5F7] placeholder:text-[#6B7280] focus:outline-none focus:border-[#B8FF2E]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Production Mode */}
          <div>
            <span className="block text-xs font-medium text-[#E4E7EC] mb-2">
              Workflow Mode
            </span>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[#0B0C0E] border border-white/[0.08]">
              {(['auto', 'studio'] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`py-2 px-3 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    mode === m
                      ? 'bg-[#20242C] text-[#F4F5F7]'
                      : 'text-[#A1A7B3] hover:text-[#F4F5F7]'
                  }`}
                >
                  {m === 'auto' ? 'Auto Mode' : 'Studio Mode'}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Style */}
          <div>
            <span className="block text-xs font-medium text-[#E4E7EC] mb-2">
              Visual Style
            </span>
            <div className="grid grid-cols-2 gap-2 p-1 rounded-lg bg-[#0B0C0E] border border-white/[0.08]">
              {(['3D', '2D'] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setVisualStyle(style)}
                  className={`py-2 px-3 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    visualStyle === style
                      ? 'bg-[#20242C] text-[#F4F5F7]'
                      : 'text-[#A1A7B3] hover:text-[#F4F5F7]'
                  }`}
                >
                  {style} Animated
                </button>
              ))}
            </div>
          </div>

          {/* Script Language */}
          <div>
            <label
              htmlFor="reel-language"
              className="block text-xs font-medium text-[#E4E7EC] mb-2"
            >
              Script Language
            </label>
            <select
              id="reel-language"
              value={language}
              onChange={(e) => setLanguage(e.target.value as ScriptLanguage)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C0E] border border-white/[0.1] text-sm text-[#F4F5F7] focus:outline-none focus:border-[#B8FF2E]"
            >
              <option value="Hinglish">Hinglish</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          {/* Tone */}
          <div>
            <label
              htmlFor="reel-tone"
              className="block text-xs font-medium text-[#E4E7EC] mb-2"
            >
              Narrative Tone
            </label>
            <select
              id="reel-tone"
              value={tone}
              onChange={(e) => setTone(e.target.value as ScriptTone)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C0E] border border-white/[0.1] text-sm text-[#F4F5F7] focus:outline-none focus:border-[#B8FF2E]"
            >
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Character Selection */}
          <div>
            <label
              htmlFor="reel-character"
              className="block text-xs font-medium text-[#E4E7EC] mb-2"
            >
              Character Host
            </label>
            <select
              id="reel-character"
              value={characterId}
              onChange={(e) => setCharacterId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C0E] border border-white/[0.1] text-sm text-[#F4F5F7] focus:outline-none focus:border-[#B8FF2E]"
            >
              {characters.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.style})
                </option>
              ))}
            </select>
          </div>

          {/* Voice Selection */}
          <div>
            <label
              htmlFor="reel-voice"
              className="block text-xs font-medium text-[#E4E7EC] mb-2"
            >
              Voiceover Preset
            </label>
            <select
              id="reel-voice"
              value={voiceId}
              onChange={(e) => setVoiceId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C0E] border border-white/[0.1] text-sm text-[#F4F5F7] focus:outline-none focus:border-[#B8FF2E]"
            >
              {DEMO_VOICES.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name} — {v.language}
                </option>
              ))}
            </select>
          </div>

          {/* Background Music */}
          <div>
            <label
              htmlFor="reel-music"
              className="block text-xs font-medium text-[#E4E7EC] mb-2"
            >
              Background Music
            </label>
            <select
              id="reel-music"
              value={musicTrack}
              onChange={(e) => setMusicTrack(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C0E] border border-white/[0.1] text-sm text-[#F4F5F7] focus:outline-none focus:border-[#B8FF2E]"
            >
              {DEMO_MUSIC_TRACKS.map((track) => (
                <option key={track} value={track}>
                  {track}
                </option>
              ))}
            </select>
          </div>

          {/* Caption Style */}
          <div>
            <label
              htmlFor="reel-captions"
              className="block text-xs font-medium text-[#E4E7EC] mb-2"
            >
              Caption Style
            </label>
            <select
              id="reel-captions"
              value={captionStyle}
              onChange={(e) => setCaptionStyle(e.target.value as CaptionStyle)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0B0C0E] border border-white/[0.1] text-sm text-[#F4F5F7] focus:outline-none focus:border-[#B8FF2E]"
            >
              {CAPTION_STYLES.map((cs) => (
                <option key={cs} value={cs}>
                  {cs}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Duration Slider & Locked Output Specs */}
        <div className="pt-2 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <label htmlFor="reel-duration" className="font-medium text-[#E4E7EC]">
                Target Duration (30–60 seconds)
              </label>
              <span className="font-mono font-semibold text-[#B8FF2E] tabular-nums">
                {durationSeconds}s
              </span>
            </div>
            <input
              id="reel-duration"
              type="range"
              min={30}
              max={60}
              step={1}
              value={durationSeconds}
              onChange={(e) => setDurationSeconds(Number(e.target.value))}
              className="w-full accent-[#B8FF2E] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-[#A1A7B3] font-mono tabular-nums">
            <div>
              <span className="block text-[#6B7280]">Aspect Ratio</span>
              <span className="text-[#F4F5F7]">9:16 Vertical</span>
            </div>
            <div>
              <span className="block text-[#6B7280]">Output Target</span>
              <span className="text-[#F4F5F7]">1080 × 1920 · 30 FPS</span>
            </div>
          </div>
        </div>

        {error && (
          <p className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B8FF2E] text-[#0B0C0E] text-sm font-semibold hover:bg-[#c8ff59] disabled:opacity-60 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>
              {submitting ? 'Saving Brief...' : 'Create Brief & Open Script Editor'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
