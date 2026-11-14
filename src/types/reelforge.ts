export type ProductionMode = 'auto' | 'studio';

export type VisualStyle = '2D' | '3D';

export type ScriptLanguage = 'English' | 'Hindi' | 'Hinglish';

export type ScriptTone =
  | 'Documentary'
  | 'Conversational'
  | 'Educational'
  | 'High-Energy'
  | 'Editorial';

export type CaptionStyle =
  | 'Bold Kinetic'
  | 'Minimal Lower Third'
  | 'Word Highlight'
  | 'Clean Editorial';

export type ProjectStatus = 'Draft' | 'Planned' | 'Demo Ready' | 'Needs Setup';

export type StudioRoute =
  | 'dashboard'
  | 'generator'
  | 'script'
  | 'characters'
  | 'production'
  | 'timeline'
  | 'export';

export interface ScenePlan {
  sceneNumber: number;
  duration: number;
  narration: string;
  visualDescription: string;
  characterDescription: string;
  cameraMovement: string;
  backgroundDescription: string;
  textOverlays: string;
  transition: string;
  soundEffect: string;
  previewImageUrl?: string;
}

export interface CharacterAsset {
  id: string;
  name: string;
  style: VisualStyle;
  description: string;
  referenceImageUrl: string;
  expressions: string[];
  poses: string[];
  isDemo: boolean;
}

export interface ReelProject {
  id: string;
  title: string;
  topic: string;
  mode: ProductionMode;
  language: ScriptLanguage;
  tone: ScriptTone;
  durationSeconds: number;
  visualStyle: VisualStyle;
  characterId: string;
  voiceId: string;
  aspectRatio: '9:16';
  resolution: '1080p';
  musicTrack: string;
  captionStyle: CaptionStyle;
  status: ProjectStatus;
  updatedAt: string;
  thumbnailUrl: string;
  hook: string;
  cta: string;
  scenes: ScenePlan[];
  isDemo: boolean;
}

export interface VoiceOption {
  id: string;
  name: string;
  language: ScriptLanguage;
  timbre: string;
  pacing: string;
}

export interface ProviderStatus {
  id: 'gemini' | 'image' | 'video' | 'tts' | 'firebase' | 'ffmpeg';
  label: string;
  phase: string;
  configured: boolean;
  requirement: string;
}

export interface CapabilitiesResponse {
  phase: number;
  demoModeActive: boolean;
  providers: ProviderStatus[];
}

export interface DemoSessionUser {
  uid?: string;
  name: string;
  email: string;
  photoUrl?: string;
  plan: 'Creator' | 'Studio Pro' | 'Production Team';
  creditsRemaining: number;
  creditsTotal: number;
  isDemoSession: boolean;
}
