/**
 * AI PROVIDER INTERFACES
 *
 * The rest of the app only talks to this abstraction. Swapping the AI backend
 * (Gemini, OpenAI, local, etc.) is a matter of implementing `AiProvider` and
 * registering it in `index.ts`.
 */

export interface ScopeExtraction {
  title: string;
  deliverables: string[];
  priceAdjustment: number;
  extraTimeDays: number;
}

export type Tone = 'friendly' | 'neutral' | 'firm';

export interface ClientMessageInput {
  title: string;
  deliverables: string[];
  priceAdjustment: number;
  extraTimeDays: number;
  validUntil?: string;
  tone: Tone;
}

export interface AiProvider {
  /** Stable identifier, e.g. 'gemini' | 'mock' */
  readonly id: string;
  /** True when the provider is configured and ready to use. */
  readonly isAvailable: boolean;
  /** Turns a raw "Brain Dump" into structured scope data. */
  extractScopeFromBrainDump(brainDump: string): Promise<ScopeExtraction>;
  /** Drafts a client-facing message for a scope adjustment. */
  generateClientMessage(input: ClientMessageInput): Promise<string>;
}

export interface AiStatus {
  /** Active provider id. */
  provider: string;
  /** True when a real AI provider is configured and available. */
  enabled: boolean;
}
