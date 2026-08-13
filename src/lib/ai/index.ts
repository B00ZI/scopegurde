/**
 * AI SERVICE FACADE — the only integration point the app needs.
 *
 * Provider selection:
 *   AI_PROVIDER=mock   (default) -> offline heuristics, no key required
 *   AI_PROVIDER=gemini           -> Google Gemini (requires GEMINI_API_KEY)
 *
 * If a real provider is requested but not configured, we safely fall back to
 * the mock provider so the app always works.
 */

import { geminiProvider } from './gemini';
import { mockProvider } from './mock';
import type { AiProvider, AiStatus } from './types';

const configured = (process.env.AI_PROVIDER || 'mock').toLowerCase();

function resolveProvider(): AiProvider {
  if (configured === 'gemini') {
    if (geminiProvider.isAvailable) return geminiProvider;
    console.warn(
      '[ScopeGuard AI] AI_PROVIDER=gemini but GEMINI_API_KEY is missing. Falling back to offline mock mode.'
    );
    return mockProvider;
  }
  return mockProvider;
}

/** Active AI provider. All pages call methods on this object. */
export const ai: AiProvider = resolveProvider();

/** Derived status for UI badges / settings display. */
export const aiStatus: AiStatus = {
  provider: ai.id,
  enabled: ai.id !== 'mock' && ai.isAvailable,
};
