/**
 * MOCK AI PROVIDER (OFFLINE MODE)
 *
 * Deterministic, dependency-free stand-in so the entire app works with no
 * API key and no network. The "extraction" uses lightweight heuristics on the
 * brain dump text; message generation uses the tone templates.
 *
 * This is what the app uses by default (`AI_PROVIDER=mock`).
 */

import type { AiProvider, ClientMessageInput, ScopeExtraction } from './types';

function extractMock(brainDump: string): ScopeExtraction {
  const text = brainDump.trim();
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);

  const deliverables = lines
    .filter((l) => /^[-*•]\s/.test(l) || /^\d+[.)]\s/.test(l))
    .map((l) => l.replace(/^[-*•]\s+/, '').replace(/^\d+[.)]\s+/, ''));

  const title =
    (lines[0] || text).replace(/\s+/g, ' ').slice(0, 60) || 'Scope Adjustment';

  const priceMatch = text.match(/(\$|usd|€|£)\s?(\d+(?:[.,]\d+)?)/i);
  const priceAdjustment = priceMatch
    ? parseFloat(priceMatch[2].replace(',', ''))
    : 0;

  const timeMatch = text.match(/(\d+)\s*(days?|weeks?)/i);
  const extraTimeDays = timeMatch
    ? timeMatch[2].toLowerCase().startsWith('week')
      ? parseInt(timeMatch[1]) * 7
      : parseInt(timeMatch[1])
    : 0;

  return {
    title,
    deliverables: deliverables.length ? deliverables : ['Review scope notes', 'Confirm deliverables'],
    priceAdjustment,
    extraTimeDays,
  };
}

function messageTemplate(input: ClientMessageInput): string {
  const { title, validUntil } = input;
  const portalLink = 'https://scopeguard.app/approval-portal/SC-4821';
  const deadlineStr = validUntil ? `by ${validUntil}` : 'as soon as possible';

  if (input.tone === 'friendly') {
    return `Hi there,

We've prepared an update regarding "${title}".

Please review and approve the details at your earliest convenience, ideally ${deadlineStr}, so we can keep things moving smoothly along.

You can access your secure portal right here to see the full details:
${portalLink}

Let me know if you have any questions!

Best,
The ScopeGuard Team`;
  }

  if (input.tone === 'firm') {
    return `Attention required:

A new scope adjustment for "${title}" requires your approval.

To avoid any delays in the project schedule, this must be reviewed and approved ${deadlineStr}.

Please review the complete details and submit your approval via your secure client portal:
${portalLink}

Thank you,
ScopeGuard Operations`;
  }

  return `Hello,

A scope adjustment for "${title}" is ready for your review.

Please follow the link below to review and approve the details ${deadlineStr}.

Secure Client Portal:
${portalLink}

Regards,
The ScopeGuard Team`;
}

export const mockProvider: AiProvider = {
  id: 'mock',
  isAvailable: true,
  async extractScopeFromBrainDump(brainDump) {
    return extractMock(brainDump);
  },
  async generateClientMessage(input) {
    return messageTemplate(input);
  },
};
