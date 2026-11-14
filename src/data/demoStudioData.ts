import {
  CharacterAsset,
  DemoSessionUser,
  ReelProject,
  VoiceOption,
} from '../types/reelforge';

export const STUDIO_SHOWCASE_IMAGE = '/src/assets/images/hero_studio_showcase_1794627194798.jpg';
export const CREATOR_AVATAR_IMAGE = '/src/assets/images/avatar_creator_profile_1794627196114.jpg';

export const DEMO_VOICES: VoiceOption[] = [
  {
    id: 'voice-hinglish-arjun',
    name: 'Arjun (Conversational)',
    language: 'Hinglish',
    timbre: 'Warm Baritone',
    pacing: '1.05x Natural',
  },
  {
    id: 'voice-hindi-kavya',
    name: 'Kavya (Narrative)',
    language: 'Hindi',
    timbre: 'Clear Studio Alto',
    pacing: '1.00x Measured',
  },
  {
    id: 'voice-english-marcus',
    name: 'Marcus (Documentary)',
    language: 'English',
    timbre: 'Crisp Mid-Low',
    pacing: '0.98x Deliberate',
  },
  {
    id: 'voice-hinglish-tara',
    name: 'Tara (Explainer)',
    language: 'Hinglish',
    timbre: 'Bright Editorial',
    pacing: '1.08x Crisp',
  },
];

export const DEMO_MUSIC_TRACKS: string[] = [
  'Subtle Analog Pulse — 110 BPM',
  'Minimalist Felt Piano — 84 BPM',
  'Clean Synth Documentary — 102 BPM',
  'Acoustic Lo-Fi Groove — 92 BPM',
  'No Background Music',
];

export const DEMO_CHARACTERS: CharacterAsset[] = [
  {
    id: 'char-dev-3d',
    name: 'Kabir',
    style: '3D',
    description:
      'Tech founder in matte charcoal hoodie and rectangular frames, clean studio lighting with subtle lime edge light.',
    referenceImageUrl: '/src/assets/images/demo_reel_tech_1794627194847.jpg',
    expressions: ['Focused', 'Explaining', 'Surprised', 'Confident'],
    poses: ['Studio Standing', 'Three-Quarter Gesture', 'Desk Lean'],
    isDemo: true,
  },
  {
    id: 'char-ananya-2d',
    name: 'Ananya',
    style: '2D',
    description:
      'Editorial founder in tailored charcoal blazer and sage trousers overlooking a dusk metro skyline.',
    referenceImageUrl: '/src/assets/images/demo_reel_finance_1794627195937.jpg',
    expressions: ['Thoughtful', 'Analytical', 'Warm Smile'],
    poses: ['Window Profile', 'Holding Coffee', 'Pointing Chart'],
    isDemo: true,
  },
  {
    id: 'char-zoya-3d',
    name: 'Zoya',
    style: '3D',
    description:
      'High-altitude expedition storyteller in dark alpine technical shell and emerald pack.',
    referenceImageUrl: '/src/assets/images/demo_reel_story_1794627195352.jpg',
    expressions: ['Determined', 'Awe', 'Calm'],
    poses: ['Cliff Overlook', 'Trail Stride', 'Close Portrait'],
    isDemo: true,
  },
];

export const DEMO_PROJECTS: ReelProject[] = [
  {
    id: 'demo-hinglish-ai-workflow',
    title: 'Why 90% of Creator Channels Burn Out in 60 Days',
    topic: 'Creator burnout and systematic batch production in Hinglish',
    mode: 'auto',
    language: 'Hinglish',
    tone: 'Conversational',
    durationSeconds: 42,
    visualStyle: '3D',
    characterId: 'char-dev-3d',
    voiceId: 'voice-hinglish-arjun',
    aspectRatio: '9:16',
    resolution: '1080p',
    musicTrack: 'Subtle Analog Pulse — 110 BPM',
    captionStyle: 'Bold Kinetic',
    status: 'Demo Ready',
    updatedAt: 'Sample Reel · 42s',
    thumbnailUrl: '/src/assets/images/demo_reel_tech_1794627194847.jpg',
    hook: 'Har roz ek naya Reel shoot karne ki wajah se 90% creators 60 days mein quit kar dete hain.',
    cta: 'Save this 4-step batching framework for your next Sunday shoot.',
    isDemo: true,
    scenes: [
      {
        sceneNumber: 1,
        duration: 8,
        narration:
          'Har roz ek naya Reel shoot karne ki wajah se 90% creators 60 days mein quit kar dete hain.',
        visualDescription:
          'Kabir stands centered in the dark charcoal studio, leaning slightly forward toward the lens as a soft lime rim light defines his silhouette.',
        characterDescription: 'Kabir (3D, charcoal hoodie, dark frames, confident posture)',
        cameraMovement: 'Slow 6% push-in from medium wide to medium close-up',
        backgroundDescription: 'Acoustic charcoal studio panels with muted desk monitor behind',
        textOverlays: '90% Creators Quit in 60 Days',
        transition: 'Hard cut on beat',
        soundEffect: 'Subtle low whoosh + soft click',
        previewImageUrl: '/src/assets/images/demo_reel_tech_1794627194847.jpg',
      },
      {
        sceneNumber: 2,
        duration: 12,
        narration:
          'Problem camera ya editing nahi hai — problem hai daily decision fatigue. Jab aap script, character aur voice ek system mein lock karte ho, output 4x fast ho jata hai.',
        visualDescription:
          'Split visual rhythm shifting to editorial urban evening workspace while narration contrasts daily chaos against structured batching.',
        characterDescription: 'Kabir gesturing to an invisible 3-step visual list on the right third',
        cameraMovement: 'Subtle lateral parallax pan left-to-right',
        backgroundDescription: 'Clean dark studio wall with subtle geometric timeline overlay',
        textOverlays: 'Fix Decision Fatigue -> Systematize',
        transition: 'Directional whip slide',
        soundEffect: 'Clean mechanical switch',
        previewImageUrl: '/src/assets/images/demo_reel_finance_1794627195937.jpg',
      },
      {
        sceneNumber: 3,
        duration: 14,
        narration:
          'Step one: Ek hi afternoon mein chaar hooks lock karo. Step two: Apna reusable character aur voice preset save rakho taaki har scene consistent lage.',
        visualDescription:
          'Crisp motion card callouts synced with Kabir delivering each step clearly.',
        characterDescription: 'Kabir medium close-up, expressive hand count for steps 1 and 2',
        cameraMovement: 'Steady lock-off with micro breathing motion',
        backgroundDescription: 'Matte slate studio backdrop with low-contrast depth blur',
        textOverlays: '01. Batch Hooks  ·  02. Lock Character & Voice',
        transition: 'Cross dissolve 0.25s',
        soundEffect: 'Soft synth chime on step markers',
        previewImageUrl: '/src/assets/images/demo_reel_tech_1794627194847.jpg',
      },
      {
        sceneNumber: 4,
        duration: 8,
        narration:
          'Phir Sunday ke sirf 90 minutes mein poore hafte ke Reels 1080p mein export ready. Save this workflow.',
        visualDescription:
          'Closing wide portrait frame with clean kinetic CTA caption anchored in upper-lower safe zone.',
        characterDescription: 'Kabir relaxed nod toward camera',
        cameraMovement: 'Gentle pull-back 4%',
        backgroundDescription: 'Charcoal studio with warm key fade',
        textOverlays: 'Save This 90-Min Sunday Workflow',
        transition: 'Clean fade to black',
        soundEffect: 'Warm sub-bass resolve',
        previewImageUrl: '/src/assets/images/demo_reel_tech_1794627194847.jpg',
      },
    ],
  },
  {
    id: 'demo-2d-bootstrapped-saas',
    title: 'How Solo Founders Price B2B Software Without Guessing',
    topic: 'Value-based SaaS pricing breakdown in 2D editorial style',
    mode: 'studio',
    language: 'English',
    tone: 'Editorial',
    durationSeconds: 36,
    visualStyle: '2D',
    characterId: 'char-ananya-2d',
    voiceId: 'voice-english-marcus',
    aspectRatio: '9:16',
    resolution: '1080p',
    musicTrack: 'Minimalist Felt Piano — 84 BPM',
    captionStyle: 'Clean Editorial',
    status: 'Demo Ready',
    updatedAt: 'Sample Reel · 36s',
    thumbnailUrl: '/src/assets/images/demo_reel_finance_1794627195937.jpg',
    hook: 'Charging $9 a month does not make your product easier to sell—it just forces you to find ten times as many customers.',
    cta: 'Follow for grounded unit economics breakdowns every Tuesday.',
    isDemo: true,
    scenes: [
      {
        sceneNumber: 1,
        duration: 10,
        narration:
          'Charging nine dollars a month does not make your product easier to sell—it forces you to find ten times as many buyers.',
        visualDescription:
          'Ananya looks over the twilight skyline from a tall studio window as crisp editorial typography enters cleanly.',
        characterDescription: 'Ananya (2D editorial vector, dark blazer, sage trousers)',
        cameraMovement: 'Slow vertical crane drift upward',
        backgroundDescription: 'Twilight glass office overlooking minimalist city towers',
        textOverlays: 'The $9/mo SaaS Trap',
        transition: 'Clean match cut',
        soundEffect: 'Muted paper fold',
        previewImageUrl: '/src/assets/images/demo_reel_finance_1794627195937.jpg',
      },
      {
        sceneNumber: 2,
        duration: 16,
        narration:
          'Anchor your price to the cost of the manual hours you replace. If your workflow saves a team twelve hours every week, seventy-nine dollars is an obvious yes.',
        visualDescription:
          'Clean geometric comparison bars animate smoothly beside Ananya at her studio desk.',
        characterDescription: 'Ananya seated reviewing printed layout sheets',
        cameraMovement: 'Subtle 5% push-in on desk surface',
        backgroundDescription: 'Warm lamp glow contrasting twilight skyline',
        textOverlays: '12 hrs saved/wk -> $79/mo Anchor',
        transition: 'Slide left 0.3s',
        soundEffect: 'Soft wooden tick',
        previewImageUrl: '/src/assets/images/demo_reel_finance_1794627195937.jpg',
      },
      {
        sceneNumber: 3,
        duration: 10,
        narration:
          'Fewer customers, deeper support, healthier margins. Follow for grounded unit economics every Tuesday.',
        visualDescription:
          'Final architectural silhouette over city lights with clear editorial end card.',
        characterDescription: 'Ananya standing profile by studio glass',
        cameraMovement: 'Locked static composition',
        backgroundDescription: 'Dusk skyline',
        textOverlays: 'Price the Outcome, Not the Seat',
        transition: 'Fade out',
        soundEffect: 'Felt piano final chord',
        previewImageUrl: '/src/assets/images/demo_reel_finance_1794627195937.jpg',
      },
    ],
  },
  {
    id: 'demo-3d-spiti-expedition',
    title: 'Three Quiet Lessons From Crossing Spiti at Dawn',
    topic: 'High-altitude storytelling in cinematic 3D animation',
    mode: 'auto',
    language: 'Hindi',
    tone: 'Documentary',
    durationSeconds: 45,
    visualStyle: '3D',
    characterId: 'char-zoya-3d',
    voiceId: 'voice-hindi-kavya',
    aspectRatio: '9:16',
    resolution: '1080p',
    musicTrack: 'Clean Synth Documentary — 102 BPM',
    captionStyle: 'Minimal Lower Third',
    status: 'Demo Ready',
    updatedAt: 'Sample Reel · 45s',
    thumbnailUrl: '/src/assets/images/demo_reel_story_1794627195352.jpg',
    hook: '14,000 feet ki oonchai par jab hawa tham jaati hai, tab aapko asli silence ka matlab samajh aata hai.',
    cta: 'Part two dekhne ke liye profile check karein.',
    isDemo: true,
    scenes: [
      {
        sceneNumber: 1,
        duration: 15,
        narration:
          'Chaudah hazaar feet ki oonchai par jab hawa tham jaati hai, tab aapko asli khamoshi ka matlab samajh aata hai.',
        visualDescription:
          'Zoya stands on a wet basalt cliff edge overlooking mist-filled valleys at first light.',
        characterDescription: 'Zoya (3D animated explorer, dark alpine jacket, emerald pack)',
        cameraMovement: 'Slow orbital arc around cliff edge',
        backgroundDescription: 'Misty mountain ridge with distant valley lights',
        textOverlays: '14,000 ft · Spiti Valley',
        transition: 'Atmospheric dissolve',
        soundEffect: 'High-altitude wind ambience',
        previewImageUrl: '/src/assets/images/demo_reel_story_1794627195352.jpg',
      },
      {
        sceneNumber: 2,
        duration: 18,
        narration:
          'Yahan speed se zyada rhythm zaroori hoti hai. Har kadam sirf agle patthar tak socha jaata hai.',
        visualDescription:
          'Close detail on trekking pole planting onto damp slate rock as morning clouds drift across the ridge.',
        characterDescription: 'Zoya profile gazing across valley peaks',
        cameraMovement: 'Tight push toward horizon',
        backgroundDescription: 'Layered jagged mountain silhouettes',
        textOverlays: 'Rhythm Over Speed',
        transition: 'Cross dissolve',
        soundEffect: 'Footstep on gravel + ambient pad swell',
        previewImageUrl: '/src/assets/images/demo_reel_story_1794627195352.jpg',
      },
      {
        sceneNumber: 3,
        duration: 12,
        narration:
          'Aur jab pehli dhoop pahaadon ko chhooti hai, saari thakaan ek pal mein gayab ho jaati hai.',
        visualDescription:
          'Golden horizon line warms the misty cloud layer below the cliff.',
        characterDescription: 'Zoya wide silhouette against clearing dawn sky',
        cameraMovement: 'Slow pull-back reveal',
        backgroundDescription: 'Dawn horizon over Spiti ridge',
        textOverlays: 'Part 02 Next Week',
        transition: 'Slow fade',
        soundEffect: 'Warm synth sustain',
        previewImageUrl: '/src/assets/images/demo_reel_story_1794627195352.jpg',
      },
    ],
  },
];

export const DEFAULT_DEMO_USER: DemoSessionUser = {
  name: 'Harshul Jain',
  email: 'iam.harshuljain@gmail.com',
  plan: 'Studio Pro',
  creditsRemaining: 42,
  creditsTotal: 60,
  isDemoSession: true,
};
