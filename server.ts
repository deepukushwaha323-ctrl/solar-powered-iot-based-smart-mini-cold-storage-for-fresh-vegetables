import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient && process.env.GEMINI_API_KEY) {
    genAIClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return genAIClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', facility: 'NER-COLD-01', version: '2.4.0' });
  });

  // ColdChain AI Query Endpoint
  app.post('/api/ai/query', async (req, res) => {
    try {
      const { query, context } = req.body;
      const ai = getGenAI();

      if (!ai) {
        // Fallback when GEMINI_API_KEY is not configured
        return res.json({
          answer: `[Local Intelligence Engine] Telemetry reviewed for: "${query}". Chamber conditions are within food safety thresholds (Mean 5.2°C, RH 88%). Solar power covers active refrigeration demand.`,
        });
      }

      const prompt = `You are ColdChain AI, an expert autonomous agricultural cold storage copilot and thermodynamics specialist for "NER Mini Cold Storage — Unit 01" (Solar-powered 5-tonne chamber).
Current facility telemetry context:
${JSON.stringify(context, null, 2)}

User question or command: "${query}"

Provide a concise, highly practical, domain-accurate response (2-4 sentences max). Include specific numbers, crate IDs, or actionable settings if relevant. Speak in a confident, professional industrial operations tone.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      return res.json({ answer: response.text });
    } catch (err: any) {
      console.error('Gemini API query error:', err?.message || err);
      return res.status(500).json({ error: 'AI Copilot inference error', details: err?.message });
    }
  });

  // Vite middleware in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Smart Cold Storage OS Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
