import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import {createServer as createViteServer} from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({limit: '2mb'}));

  // Phase 1 Health Endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'reelforge-ai',
      phase: 2,
      timestamp: new Date().toISOString(),
    });
  });

  // Real environment capability inspection (never returns secret values)
  app.get('/api/capabilities', async (_req, res) => {
    const hasGemini =
      Boolean(process.env.GEMINI_API_KEY) &&
      process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';
    const hasTts = Boolean(process.env.GOOGLE_CLOUD_TTS_KEY);
    const hasVideoProvider = Boolean(process.env.VIDEO_PROVIDER_API_KEY);

    let firebaseProjectId = process.env.FIREBASE_PROJECT_ID || '';
    try {
      const fs = await import('fs/promises');
      const rawCfg = await fs.readFile(
        path.resolve(__dirname, 'firebase-applet-config.json'),
        'utf-8'
      );
      const parsedCfg = JSON.parse(rawCfg) as {projectId?: string};
      if (parsedCfg.projectId && parsedCfg.projectId !== 'remixed-project-id') {
        firebaseProjectId = parsedCfg.projectId;
      }
    } catch {
      // firebase-applet-config.json absent or unreadable
    }
    const hasFirebase = Boolean(firebaseProjectId);

    res.json({
      phase: 2,
      demoModeActive: !hasGemini || !hasTts || !hasVideoProvider || !hasFirebase,
      providers: [
        {
          id: 'firebase',
          label: 'Firebase Auth & Firestore',
          phase: 'Phase 2',
          configured: hasFirebase,
          requirement: hasFirebase
            ? `Connected to project ${firebaseProjectId}`
            : 'Firebase project provisioning required',
        },
        {
          id: 'gemini',
          label: 'Gemini Script & Scene Planner',
          phase: 'Phase 3',
          configured: hasGemini,
          requirement: hasGemini
            ? 'GEMINI_API_KEY detected (adapter activates in Phase 3)'
            : 'Set GEMINI_API_KEY in server environment secrets',
        },
        {
          id: 'image',
          label: 'Gemini Image & Character Engine',
          phase: 'Phase 4',
          configured: hasGemini,
          requirement: hasGemini
            ? 'GEMINI_API_KEY detected (image pipeline activates in Phase 4)'
            : 'Set GEMINI_API_KEY in server environment secrets',
        },
        {
          id: 'video',
          label: 'AI Video Motion Generator',
          phase: 'Phase 5',
          configured: hasVideoProvider,
          requirement: hasVideoProvider
            ? 'VIDEO_PROVIDER_API_KEY detected (activates in Phase 5)'
            : 'Set VIDEO_PROVIDER_API_KEY in server environment secrets',
        },
        {
          id: 'tts',
          label: 'Google Cloud Text-to-Speech',
          phase: 'Phase 5',
          configured: hasTts,
          requirement: hasTts
            ? 'GOOGLE_CLOUD_TTS_KEY detected (activates in Phase 5)'
            : 'Set GOOGLE_CLOUD_TTS_KEY in server environment secrets',
        },
        {
          id: 'ffmpeg',
          label: 'FFmpeg + Remotion 1080p Renderer',
          phase: 'Phase 7',
          configured: false,
          requirement: 'Server-side FFmpeg & Remotion render pipeline scheduled for Phase 7',
        },
      ],
    });
  });

  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {middlewareMode: true},
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ReelForge AI server listening on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start ReelForge AI server:', err);
  process.exit(1);
});
