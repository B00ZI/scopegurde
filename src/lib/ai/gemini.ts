/**
 * GEMINI AI PROVIDER (OPTIONAL)
 *
 * Enable by setting `AI_PROVIDER=gemini` AND `GEMINI_API_KEY` in `.env`.
 * The SDK is only loaded (dynamic import) when a call is actually made and a
 * key is present, so this file never breaks the app when AI is off.
 */

import type { AiProvider, ClientMessageInput, ScopeExtraction } from './types';

const apiKey = process.env.GEMINI_API_KEY;

export const geminiProvider: AiProvider = {
  id: 'gemini',
  isAvailable: Boolean(apiKey),

  async extractScopeFromBrainDump(brainDump) {
    const { client, Type } = await loadGemini();
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Extract structured scope details from the following brain dump: "${brainDump}"`,
      config: {
        systemInstruction: 'You are an expert logistics project manager. Extract scope, pricing, and timeline details from unstructured text.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            deliverables: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            priceAdjustment: { type: Type.NUMBER },
            extraTimeDays: { type: Type.NUMBER },
          },
          required: ['title', 'deliverables', 'priceAdjustment', 'extraTimeDays'],
        },
      },
    });

    const parsed = JSON.parse(response.text);
    return {
      title: parsed.title || '',
      deliverables: Array.isArray(parsed.deliverables) ? parsed.deliverables : [],
      priceAdjustment: Number(parsed.priceAdjustment) || 0,
      extraTimeDays: Number(parsed.extraTimeDays) || 0,
    };
  },

  async generateClientMessage(input: ClientMessageInput) {
    const { client } = await loadGemini();
    const response = await client.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: `Generate a polished client message for a scope adjustment with the following details: ${JSON.stringify(input)}. The tone should be ${input.tone}.`,
      config: {
        systemInstruction:
          'You are a professional account manager at ScopeGuard. Write a clear, persuasive message explaining the surcharge. If a validUntil date is provided, ensure it is prominently mentioned as a deadline. Always end the message by asking the client to review and approve the details at the following secure portal: https://scopeguard.app/approval-portal/SC-4821. Do not wrap the URL in markdown brackets, just output it as a plain string.',
      },
    });

    return response.text;
  },
};

/** Lazily loads and caches the Gemini client. Throws a clear error if no key. */
let cached: { client: any; Type: any } | null = null;

async function loadGemini() {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured. Set AI_PROVIDER=mock or add a key to .env.');
  }
  if (!cached) {
    const mod = await import('@google/genai');
    cached = {
      client: new mod.GoogleGenAI({ apiKey }),
      Type: mod.Type,
    };
  }
  return cached;
}
