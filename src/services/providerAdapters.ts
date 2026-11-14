import {
  CapabilitiesResponse,
  CharacterAsset,
  ReelProject,
  ScenePlan,
  ScriptLanguage,
  ScriptTone,
  VisualStyle,
} from '../types/reelforge';

export interface ScriptPlannerRequest {
  topic: string;
  language: ScriptLanguage;
  tone: ScriptTone;
  targetDurationSeconds: number;
  visualStyle: VisualStyle;
}

export interface ScriptPlannerResponse {
  hook: string;
  cta: string;
  scenes: ScenePlan[];
  providerName: string;
}

export interface ScriptPlannerAdapter {
  readonly providerId: string;
  generateScenePlan(input: ScriptPlannerRequest): Promise<ScriptPlannerResponse>;
}

export interface ImageGeneratorAdapter {
  readonly providerId: string;
  generateCharacterReference(character: Pick<CharacterAsset, 'name' | 'style' | 'description'>): Promise<string>;
  generateSceneFrame(scene: ScenePlan, style: VisualStyle): Promise<string>;
}

export interface VideoGeneratorAdapter {
  readonly providerId: string;
  animateSceneFrame(params: {
    imageUrl: string;
    cameraMovement: string;
    durationSeconds: number;
  }): Promise<{ jobId: string; status: 'queued' | 'unavailable' }>;
}

export interface VoiceSynthesizerAdapter {
  readonly providerId: string;
  synthesizeNarration(params: {
    text: string;
    language: ScriptLanguage;
    voiceId: string;
  }): Promise<{ audioUrl: string | null; status: 'ready' | 'unavailable' }>;
}

export interface RenderEngineAdapter {
  readonly providerId: string;
  renderVerticalMp4(project: ReelProject): Promise<{
    jobId: string;
    resolution: '1080x1920';
    fps: 30;
    codec: 'H.264 / AAC';
    status: 'queued' | 'unavailable';
  }>;
}

export async function fetchProviderCapabilities(): Promise<CapabilitiesResponse> {
  try {
    const response = await fetch('/api/capabilities');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return (await response.json()) as CapabilitiesResponse;
  } catch {
    return {
      phase: 1,
      demoModeActive: true,
      providers: [
        {
          id: 'firebase',
          label: 'Firebase Auth & Firestore',
          phase: 'Phase 2',
          configured: false,
          requirement: 'Firebase project provisioning pending Phase 2',
        },
        {
          id: 'gemini',
          label: 'Gemini Script & Scene Planner',
          phase: 'Phase 3',
          configured: false,
          requirement: 'GEMINI_API_KEY required in server environment',
        },
        {
          id: 'image',
          label: 'Gemini Image & Character Engine',
          phase: 'Phase 4',
          configured: false,
          requirement: 'GEMINI_API_KEY required in server environment',
        },
        {
          id: 'video',
          label: 'AI Video Motion Generator',
          phase: 'Phase 5',
          configured: false,
          requirement: 'VIDEO_PROVIDER_API_KEY required in server environment',
        },
        {
          id: 'tts',
          label: 'Google Cloud Text-to-Speech',
          phase: 'Phase 5',
          configured: false,
          requirement: 'GOOGLE_CLOUD_TTS_KEY required in server environment',
        },
        {
          id: 'ffmpeg',
          label: 'FFmpeg + Remotion 1080p Renderer',
          phase: 'Phase 7',
          configured: false,
          requirement: 'Server render pipeline scheduled for Phase 7',
        },
      ],
    };
  }
}
