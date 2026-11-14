import {
  ArrowRight,
  Check,
  ChevronRight,
  Layers,
  Mic,
  Pause,
  Play,
  Sliders,
  Users,
  Video,
} from 'lucide-react';
import React, {useEffect, useState} from 'react';
import {DEMO_PROJECTS, STUDIO_SHOWCASE_IMAGE} from '../../data/demoStudioData';
import {DemoSessionUser, ReelProject} from '../../types/reelforge';
import {ResilientImage} from '../common/ResilientImage';
import {LandingHeader} from '../layout/LandingHeader';

interface LandingPageProps {
  onEnterStudio: (projectId?: string) => void;
  onOpenAuth: (mode: 'signin' | 'signup', plan?: DemoSessionUser['plan']) => void;
}

const WORKFLOW_STEPS = [
  {
    index: '01.',
    title: 'Topic to Structured Script',
    detail:
      'Enter an idea, tone, and language (English, Hindi, or Hinglish). Gemini breaks a 30–60 second narrative into timed scenes with hooks, camera cues, and overlay text.',
  },
  {
    index: '02.',
    title: 'Consistent 2D & 3D Characters',
    detail:
      'Build reusable hosts once with reference poses and facial expressions so your presenter stays visually identical across every cut.',
  },
  {
    index: '03.',
    title: 'Animated Motion & Natural Voice',
    detail:
      'Pair image-to-video motion frames with calibrated Hindi, English, or Hinglish voiceovers, sound effects, and subtle music ducking.',
  },
  {
    index: '04.',
    title: 'Multi-Track Timeline & 1080p MP4',
    detail:
      'Inspect or reorder scenes in Studio Mode, adjust kinetic captions, and render watermark-free 1080 × 1920 H.264 MP4 files at 30 FPS.',
  },
];

const PRICING_TIERS: Array<{
  name: DemoSessionUser['plan'];
  audience: string;
  monthlyPrice: number;
  annualPrice: number;
  credits: string;
  specs: string[];
  highlighted?: boolean;
}> = [
  {
    name: 'Creator',
    audience: 'For solo creators testing consistent short-form formats',
    monthlyPrice: 29,
    annualPrice: 24,
    credits: '20 export minutes / month',
    specs: [
      'Up to 15 vertical 1080p MP4 renders',
      '3 reusable 2D or 3D character profiles',
      'English, Hindi & Hinglish narration',
      'Zero forced watermarks',
    ],
  },
  {
    name: 'Studio Pro',
    audience: 'For weekly Reels and YouTube Shorts channels',
    monthlyPrice: 79,
    annualPrice: 64,
    credits: '60 export minutes / month',
    specs: [
      'Up to 60 vertical 1080p MP4 renders',
      '15 reusable 2D & 3D character profiles',
      'Full Studio Mode timeline & subtitle control',
      'Priority background render queue',
    ],
    highlighted: true,
  },
  {
    name: 'Production Team',
    audience: 'For agencies and multi-brand content desks',
    monthlyPrice: 199,
    annualPrice: 165,
    credits: '200 export minutes / month',
    specs: [
      'Unlimited character library & pose presets',
      'Concurrent multi-project render jobs',
      'Shared project workspaces & asset history',
      'Dedicated API quota & SLA monitoring',
    ],
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterStudio,
  onOpenAuth,
}) => {
  const [selectedDemoIndex, setSelectedDemoIndex] = useState(0);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isPlayingDemo, setIsPlayingDemo] = useState(false);
  const [previewMode, setPreviewMode] = useState<'auto' | 'studio'>('auto');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const activeDemo: ReelProject = DEMO_PROJECTS[selectedDemoIndex];
  const activeScene = activeDemo.scenes[activeSceneIndex] || activeDemo.scenes[0];

  useEffect(() => {
    setActiveSceneIndex(0);
    setIsPlayingDemo(false);
  }, [selectedDemoIndex]);

  useEffect(() => {
    if (!isPlayingDemo) return;
    const timer = window.setInterval(() => {
      setActiveSceneIndex((prev) =>
        prev + 1 >= activeDemo.scenes.length ? 0 : prev + 1
      );
    }, 3200);
    return () => window.clearInterval(timer);
  }, [isPlayingDemo, activeDemo.scenes.length]);

  const elapsedSeconds = activeDemo.scenes
    .slice(0, activeSceneIndex + 1)
    .reduce((sum, sc) => sum + sc.duration, 0);

  return (
    <div id="top" className="min-h-screen bg-[#0B0C0E] text-[#F4F5F7]">
      <LandingHeader onOpenStudio={() => onEnterStudio()} />

      <main>
        {/* Hero & Interactive Product Demonstration */}
        <section className="max-w-7xl mx-auto px-6 pt-12 pb-20 lg:pt-20 lg:pb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
            {/* Left Proposition */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <p className="text-xs font-medium tracking-wide text-[#34D399] mb-4">
                  Vertical Video Production Suite · 1080 × 1920 · Auto & Studio Modes
                </p>

                <h1
                  className="font-display font-bold tracking-tight text-[#F4F5F7] max-w-2xl"
                  style={{
                    fontSize: 'clamp(2.25rem, 4vw, 3.75rem)',
                    lineHeight: 1.08,
                    textWrap: 'balance',
                  }}
                >
                  Direct, animate, and ship 1080p Reels from a single brief.
                </h1>

                <p className="mt-6 text-base sm:text-lg text-[#A1A7B3] leading-relaxed max-w-xl">
                  ReelForge AI turns a plain topic into a timed scene plan, consistent 2D or 3D characters, natural Hindi, English, or Hinglish narration, and an editable vertical timeline—ready for watermark-free MP4 export.
                </p>

                {/* Primary & Secondary Actions */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <button
                    type="button"
                    onClick={() => onEnterStudio()}
                    className="inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-[#B8FF2E] text-[#0B0C0E] text-sm font-semibold hover:bg-[#c8ff59] active:scale-[0.98] transition-all whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Launch Studio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenAuth('signin')}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-[#14171C] border border-white/[0.1] text-[#F4F5F7] text-sm font-medium hover:bg-[#1C2026] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <span>Sign In / Create Account</span>
                  </button>
                </div>
              </div>

              {/* Dual-mode clarity block */}
              <div className="mt-12 pt-8 border-t border-white/[0.08] grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#F4F5F7]">
                    <Layers className="w-4 h-4 text-[#B8FF2E]" />
                    <span>Auto Mode</span>
                  </div>
                  <p className="mt-2 text-sm text-[#A1A7B3] leading-relaxed">
                    Generate script, scenes, character frames, voiceover, and timeline composition automatically from one prompt.
                  </p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#F4F5F7]">
                    <Sliders className="w-4 h-4 text-[#34D399]" />
                    <span>Studio Mode</span>
                  </div>
                  <p className="mt-2 text-sm text-[#A1A7B3] leading-relaxed">
                    Edit every line of narration, swap character expressions, reorder clips, and tune subtitles on a 4-track timeline.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Product Demonstration Area */}
            <div className="lg:col-span-5 flex flex-col rounded-xl bg-[#121418] border border-white/[0.08] p-5">
              <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
                <div className="text-xs text-[#A1A7B3]">
                  <span className="text-[#F4F5F7] font-medium">Demo Content Preview</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>{activeDemo.language}</span>
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span>{activeDemo.visualStyle}</span>
                </div>

                {/* Auto / Studio mode inspection toggle */}
                <div className="flex items-center gap-1 p-0.5 rounded-md bg-[#0B0C0E] border border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setPreviewMode('auto')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      previewMode === 'auto'
                        ? 'bg-[#1D2128] text-[#F4F5F7]'
                        : 'text-[#A1A7B3] hover:text-[#F4F5F7]'
                    }`}
                  >
                    Player
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewMode('studio')}
                    className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      previewMode === 'studio'
                        ? 'bg-[#1D2128] text-[#F4F5F7]'
                        : 'text-[#A1A7B3] hover:text-[#F4F5F7]'
                    }`}
                  >
                    Scene JSON
                  </button>
                </div>
              </div>

              {/* Sample selector tabs */}
              <div className="flex items-center gap-1.5 py-3 overflow-x-auto">
                {DEMO_PROJECTS.map((project, idx) => (
                  <button
                    key={project.id}
                    type="button"
                    onClick={() => setSelectedDemoIndex(idx)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      idx === selectedDemoIndex
                        ? 'bg-[#B8FF2E] text-[#0B0C0E]'
                        : 'bg-[#181B20] text-[#A1A7B3] hover:text-[#F4F5F7]'
                    }`}
                  >
                    {project.visualStyle} · {project.language}
                  </button>
                ))}
              </div>

              {/* Vertical 9:16 Stage or Scene JSON View */}
              {previewMode === 'auto' ? (
                <div className="flex-1 flex flex-col sm:flex-row gap-4 items-center sm:items-stretch pt-1">
                  {/* 9:16 Vertical Canvas */}
                  <div className="relative w-48 sm:w-52 aspect-[9/16] rounded-lg overflow-hidden bg-[#0B0C0E] border border-white/[0.1] shrink-0">
                    <ResilientImage
                      src={activeScene.previewImageUrl || activeDemo.thumbnailUrl}
                      alt={activeDemo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/35 flex flex-col justify-between p-3">
                      <div className="flex items-center justify-between text-[11px] font-mono tabular-nums text-[#E4E7EC]">
                        <span>Scene 0{activeScene.sceneNumber}</span>
                        <span>
                          {elapsedSeconds}s / {activeDemo.durationSeconds}s
                        </span>
                      </div>

                      <div className="space-y-2">
                        <p className="text-xs font-semibold text-[#B8FF2E] leading-snug bg-black/65 px-2.5 py-1.5 rounded">
                          {activeScene.textOverlays}
                        </p>
                        <p className="text-[11px] text-[#F4F5F7]/90 leading-snug line-clamp-3">
                          {activeScene.narration}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Scene Scrubber & Controls */}
                  <div className="flex-1 w-full flex flex-col justify-between gap-3">
                    <div className="space-y-1.5">
                      <p className="text-xs text-[#A1A7B3]">
                        Camera: <span className="text-[#F4F5F7]">{activeScene.cameraMovement}</span>
                      </p>
                      <p className="text-xs text-[#A1A7B3]">
                        Audio: <span className="text-[#F4F5F7]">{activeScene.soundEffect}</span>
                      </p>
                      <p className="text-xs text-[#A1A7B3]">
                        Transition: <span className="text-[#F4F5F7]">{activeScene.transition}</span>
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      {activeDemo.scenes.map((scene, idx) => (
                        <button
                          key={scene.sceneNumber}
                          type="button"
                          onClick={() => {
                            setActiveSceneIndex(idx);
                            setIsPlayingDemo(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg border text-xs transition-colors cursor-pointer ${
                            idx === activeSceneIndex
                              ? 'bg-[#1A1E25] border-[#B8FF2E]/50 text-[#F4F5F7]'
                              : 'bg-[#0B0C0E]/60 border-white/[0.06] text-[#A1A7B3] hover:text-[#F4F5F7]'
                          }`}
                        >
                          <div className="flex items-center justify-between font-mono tabular-nums">
                            <span>Scene 0{scene.sceneNumber}</span>
                            <span>{scene.duration}s</span>
                          </div>
                          <p className="truncate mt-0.5 text-[11px] opacity-85">
                            {scene.textOverlays}
                          </p>
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsPlayingDemo((prev) => !prev)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#1D2128] hover:bg-[#262B34] text-xs font-medium text-[#F4F5F7] transition-colors cursor-pointer"
                      >
                        {isPlayingDemo ? (
                          <>
                            <Pause className="w-3.5 h-3.5 text-[#B8FF2E]" />
                            <span>Pause Preview</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 text-[#B8FF2E]" />
                            <span>Play Sequence</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => onEnterStudio(activeDemo.id)}
                        className="inline-flex items-center gap-1 py-2 px-3 rounded-lg border border-white/[0.1] hover:border-[#B8FF2E]/60 text-xs font-medium text-[#F4F5F7] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        <span>Edit</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between pt-2">
                  <pre className="p-3.5 rounded-lg bg-[#0B0C0E] border border-white/[0.08] text-[11px] font-mono text-[#D1D5DB] overflow-x-auto leading-relaxed max-h-[340px]">
                    {JSON.stringify(
                      {
                        sceneNumber: activeScene.sceneNumber,
                        duration: `${activeScene.duration}s`,
                        narration: activeScene.narration,
                        characterDescription: activeScene.characterDescription,
                        cameraMovement: activeScene.cameraMovement,
                        textOverlays: activeScene.textOverlays,
                        transition: activeScene.transition,
                      },
                      null,
                      2
                    )}
                  </pre>
                  <button
                    type="button"
                    onClick={() => onEnterStudio(activeDemo.id)}
                    className="mt-3 w-full py-2 px-3 rounded-lg bg-[#1D2128] hover:bg-[#262B34] text-xs font-medium text-[#F4F5F7] transition-colors cursor-pointer"
                  >
                    Open Full Scene Plan in Studio
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section
          id="workflow"
          className="border-t border-white/[0.08] py-20 lg:py-24 max-w-7xl mx-auto px-6"
        >
          <div className="max-w-2xl mb-14">
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F5F7]">
              From a single topic to a frame-accurate vertical master
            </h2>
            <p className="mt-3 text-base text-[#A1A7B3] leading-relaxed">
              Every production stage runs through isolated provider adapters so scripts, characters, voices, and renders stay modular and verifiable.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {WORKFLOW_STEPS.map((step) => (
              <div
                key={step.index}
                className="pt-6 border-t border-white/[0.12] flex flex-col justify-between"
              >
                <div>
                  <span className="font-mono text-sm font-semibold text-[#B8FF2E] tabular-nums">
                    {step.index}
                  </span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-[#F4F5F7]">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm text-[#A1A7B3] leading-relaxed">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Studio Capabilities & Showcase */}
        <section
          id="studio"
          className="border-t border-white/[0.08] py-20 lg:py-24 max-w-7xl mx-auto px-6"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Wide Studio Asset Card */}
            <div className="lg:col-span-7 rounded-xl overflow-hidden bg-[#121418] border border-white/[0.08] flex flex-col">
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#0B0C0E]">
                <ResilientImage
                  src={STUDIO_SHOWCASE_IMAGE}
                  alt="ReelForge AI vertical production suite workspace"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h2 className="font-display text-2xl font-bold text-[#F4F5F7]">
                    Built for manual creative control when automation is not enough
                  </h2>
                  <p className="mt-3 text-sm sm:text-base text-[#A1A7B3] leading-relaxed max-w-2xl">
                    Switch seamlessly between Auto Mode generation and a 4-track vertical editor for video clips, narration audio, kinetic captions, and graphic overlays.
                  </p>
                </div>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => onEnterStudio()}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#B8FF2E] hover:underline cursor-pointer"
                  >
                    <span>Explore the Studio Interface</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Capabilities Stack */}
            <div id="showcase" className="lg:col-span-5 grid grid-cols-1 gap-4">
              <div className="rounded-xl bg-[#121418] border border-white/[0.08] p-6">
                <Users className="w-5 h-5 text-[#B8FF2E] mb-3" />
                <h3 className="font-display text-base font-semibold text-[#F4F5F7]">
                  Reusable 2D & 3D Character Vault
                </h3>
                <p className="mt-1.5 text-sm text-[#A1A7B3] leading-relaxed">
                  Save reference sheets, wardrobe details, expressions, and poses so every scene preserves character identity.
                </p>
              </div>

              <div className="rounded-xl bg-[#121418] border border-white/[0.08] p-6">
                <Mic className="w-5 h-5 text-[#34D399] mb-3" />
                <h3 className="font-display text-base font-semibold text-[#F4F5F7]">
                  Natural Hinglish, Hindi & English Voiceovers
                </h3>
                <p className="mt-1.5 text-sm text-[#A1A7B3] leading-relaxed">
                  Calibrated pacing and pronunciation tailored for conversational creator hooks and documentary explainers.
                </p>
              </div>

              <div className="rounded-xl bg-[#121418] border border-white/[0.08] p-6">
                <Video className="w-5 h-5 text-[#B8FF2E] mb-3" />
                <h3 className="font-display text-base font-semibold text-[#F4F5F7]">
                  Clean 1080 × 1920 MP4 Exports
                </h3>
                <p className="mt-1.5 text-sm text-[#A1A7B3] leading-relaxed">
                  H.264 video and AAC audio rendered at 30 FPS with zero forced ReelForge watermarks and transparent provider status.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section
          id="pricing"
          className="border-t border-white/[0.08] py-20 lg:py-24 max-w-7xl mx-auto px-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#F4F5F7]">
                Transparent studio plans
              </h2>
              <p className="mt-2 text-sm sm:text-base text-[#A1A7B3]">
                Predictable export minutes with full 1080p MP4 ownership on every tier.
              </p>
            </div>

            {/* Billing toggle belongs inside Pricing section */}
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-[#121418] border border-white/[0.08] self-start">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-[#20242C] text-[#F4F5F7]'
                    : 'text-[#A1A7B3] hover:text-[#F4F5F7]'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('annual')}
                className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  billingCycle === 'annual'
                    ? 'bg-[#20242C] text-[#F4F5F7]'
                    : 'text-[#A1A7B3] hover:text-[#F4F5F7]'
                }`}
              >
                Annual (Save 18%)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {PRICING_TIERS.map((tier) => {
              const price =
                billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice;

              return (
                <div
                  key={tier.name}
                  className={`rounded-xl p-7 flex flex-col justify-between border ${
                    tier.highlighted
                      ? 'bg-[#14171D] border-[#B8FF2E]/40'
                      : 'bg-[#121418] border-white/[0.08]'
                  }`}
                >
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-display text-lg font-semibold text-[#F4F5F7]">
                        {tier.name}
                      </h3>
                      {tier.highlighted && (
                        <span className="text-xs font-medium text-[#B8FF2E]">
                          Most popular
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm text-[#A1A7B3]">{tier.audience}</p>

                    <div className="mt-6 pb-6 border-b border-white/[0.08]">
                      <div className="flex items-baseline gap-1.5 font-mono tabular-nums">
                        <span className="text-3xl font-bold text-[#F4F5F7]">
                          ${price}
                        </span>
                        <span className="text-xs text-[#A1A7B3]">/ month</span>
                      </div>
                      <p className="mt-1 text-xs font-medium text-[#34D399]">
                        {tier.credits}
                      </p>
                    </div>

                    <ul className="mt-6 space-y-3">
                      {tier.specs.map((spec) => (
                        <li
                          key={spec}
                          className="flex items-start gap-2.5 text-sm text-[#D1D5DB]"
                        >
                          <Check className="w-4 h-4 text-[#34D399] shrink-0 mt-0.5" />
                          <span>{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => onOpenAuth('signup', tier.name)}
                    className={`mt-8 w-full py-2.5 px-4 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                      tier.highlighted
                        ? 'bg-[#B8FF2E] text-[#0B0C0E] hover:bg-[#c8ff59]'
                        : 'bg-[#1A1E25] text-[#F4F5F7] hover:bg-[#232832] border border-white/[0.08]'
                    }`}
                  >
                    Start with {tier.name}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-white/[0.08] py-10 max-w-7xl mx-auto px-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <span className="font-display text-base font-bold text-[#F4F5F7]">
              ReelForge AI
            </span>
            <p className="text-xs text-[#6B7280] mt-1">
              Phase 1 Studio Preview · Demo assets are clearly labeled and never presented as live AI renders.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 text-xs text-[#A1A7B3]">
            <a href="#workflow" className="hover:text-[#F4F5F7]">
              Workflow
            </a>
            <a href="#studio" className="hover:text-[#F4F5F7]">
              Studio
            </a>
            <a href="#pricing" className="hover:text-[#F4F5F7]">
              Pricing
            </a>
            <button
              type="button"
              onClick={() => onEnterStudio()}
              className="hover:text-[#F4F5F7] cursor-pointer"
            >
              Open Workspace
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
