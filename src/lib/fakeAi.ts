import { ChangeScopeDecision } from '../types';

export interface MilestoneExtraction {
  title: string;
  deliverables: string[];
}

export interface ContractExtraction {
  suggestedName: string;
  suggestedDeadline: string;
  milestones: MilestoneExtraction[];
  paymentTerms: string[];
  scopeRules: string[];
}

export interface ScopeCheckResult {
  decision: ChangeScopeDecision;
  confidence: number;
  reasons: string[];
  citations: string[];
}

export interface SampleContract {
  id: string;
  label: string;
  text: string;
}

export const SAMPLE_CONTRACTS: SampleContract[] = [
  {
    id: 'website',
    label: 'Website Rebuild',
    text: `Acme Corp — Website Rebuild Agreement

This agreement covers the redesign and rebuild of the Acme Corp public hub and its supporting pages, based on the approved brand guidelines.

Deliverables
1. Homepage.
2. Four inner pages (services, pricing, support, contact).
3. Brand guidelines applied across all new templates.
4. Responsive layout and WCAG AA accessibility.
5. Basic SEO configuration per page.

Payment Terms
50% upfront before kickoff. 25% on approval of the homepage design. 25% on launch.

Timeline
Twelve weeks from the kickoff date. Milestones are marked as done only after delivery and client review.

Revisions
Up to two revision rounds per deliverable. Additional rounds are quoted separately.

Out-of-Scope Work
Any work not listed above is out of scope and is quoted before it is started. Work never begins without written client approval.`,
  },
  {
    id: 'brand',
    label: 'Brand Identity',
    text: `Meridian Studio — Brand Identity Agreement

This agreement covers a complete brand identity system for Meridian Studio.

Scope
1. Logo design with 3 concepts.
2. Brand guidelines document.
3. Color palette and typography system.
4. Business card and letterhead templates.
5. Social media kit (profile and cover templates).

Terms
40% deposit before start. 60% on delivery of final files.

Timeline
Four weeks from deposit confirmation.

Usage
Full ownership transfers on final payment. Third-party font licenses are the client's responsibility.

Out of Scope
Print production, animation, and ongoing design requests are not included.`,
  },
  {
    id: 'mobile',
    label: 'Mobile App MVP',
    text: `Nexus Labs — Mobile App MVP Agreement

This agreement covers the development of an MVP mobile app for Nexus Labs.

Deliverables
1. iOS and Android app (React Native).
2. Onboarding flow with account creation.
3. Core dashboard with 3 screens.
4. Push notification support.
5. TestFlight / Play Store alpha submission.

Payment Terms
30% upfront. 40% on first milestone approval. 30% on app store submission.

Timeline
Ten weeks from kickoff.

Revisions
Two revision rounds per screen.

Out of Scope
App store fees, backend server costs, and post-launch features are not included.`,
  },
];

const POOL: ContractExtraction[] = [
  {
    suggestedName: 'Website Rebuild',
    suggestedDeadline: '2026-11-15',
    milestones: [
      { title: 'Discovery & Research', deliverables: ['Competitor analysis', 'Stakeholder interviews', 'Sitemap v1'] },
      { title: 'Wireframes', deliverables: ['Homepage wireframes', 'Inner page wireframes', 'Approved click-through'] },
      { title: 'Brand guidelines', deliverables: ['Updated type scale', 'Color tokens', 'Component styles'] },
      { title: 'Homepage design', deliverables: ['Homepage mockup', '4 inner page designs'] },
      { title: 'QA & Launch', deliverables: ['Accessibility audit', 'Cross-browser QA', 'Launch checklist'] },
    ],
    paymentTerms: ['50% upfront before kickoff', '25% on homepage design approval', '25% on launch'],
    scopeRules: ['Up to 2 revision rounds per deliverable', 'Out-of-scope work quoted before start', '12-week timeline from kickoff'],
  },
  {
    suggestedName: 'Brand Identity',
    suggestedDeadline: '2026-09-15',
    milestones: [
      { title: 'Research & moodboards', deliverables: ['Competitor brand audit', 'Moodboard presentation', 'Style direction approval'] },
      { title: 'Logo concepts', deliverables: ['3 logo concepts', 'Refinement round', 'Final logo selection'] },
      { title: 'Brand guidelines', deliverables: ['Guidelines document', 'Color palette & typography system'] },
      { title: 'Asset pack', deliverables: ['Business card & letterhead templates', 'Social media kit'] },
    ],
    paymentTerms: ['40% deposit before start', '60% on delivery of final files'],
    scopeRules: ['4-week timeline from deposit', 'Full ownership on final payment', 'Print production & animation excluded'],
  },
  {
    suggestedName: 'Mobile App MVP',
    suggestedDeadline: '2026-10-15',
    milestones: [
      { title: 'Discovery', deliverables: ['User research', 'Feature prioritization', 'Technical architecture'] },
      { title: 'UX & screen design', deliverables: ['Onboarding wireframes', 'Dashboard wireframes', 'Approved click-through'] },
      { title: 'Development', deliverables: ['React Native build', 'Onboarding flow', 'Core dashboard (3 screens)', 'Push notifications'] },
      { title: 'Testing', deliverables: ['QA testing', 'Device compatibility check'] },
      { title: 'Launch', deliverables: ['TestFlight submission', 'Play Store alpha submission'] },
    ],
    paymentTerms: ['30% upfront', '40% on first milestone approval', '30% on app store submission'],
    scopeRules: ['2 revision rounds per screen', 'App store fees & backend costs excluded', '10-week timeline from kickoff'],
  },
];

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i += 1) {
    h = (h * 31 + text.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function getFakeAnalysis(text: string, seed = 0): ContractExtraction {
  const exact = SAMPLE_CONTRACTS.findIndex((c) => c.text.trim() === text.trim());
  const base = exact >= 0 ? exact : hash(text) % POOL.length;
  return POOL[(base + seed) % POOL.length];
}

export function runFakeAnalysis(text: string, seed = 0): Promise<ContractExtraction> {
  return new Promise((resolve) => window.setTimeout(() => resolve(getFakeAnalysis(text, seed)), 2400));
}

const SCOPE_REASONS: Record<ChangeScopeDecision, string[]> = {
  'In Scope': ['The request falls within the deliverables listed in the agreement.'],
  'Needs Review': ['The request overlaps partially with the agreed scope and needs a decision.'],
  'Out of Scope': [
    'The request is not listed in the agreed deliverables.',
    'The contract requires out-of-scope work to be quoted separately before it starts.',
  ],
};

const CITATIONS = ['Contract · Agreed Work', 'Contract · Rules', 'Contract · Payment Terms'];

export function runFakeScopeCheck(): Promise<ScopeCheckResult> {
  const roll = Math.random();
  const decision: ChangeScopeDecision = roll < 0.33 ? 'In Scope' : roll < 0.55 ? 'Needs Review' : 'Out of Scope';
  const confidence = Math.round((0.72 + Math.random() * 0.24) * 100) / 100;
  const citations = CITATIONS.slice(0, 1 + Math.floor(Math.random() * 2));
  return new Promise((resolve) =>
    window.setTimeout(() => resolve({ decision, confidence, reasons: SCOPE_REASONS[decision], citations }), 1600)
  );
}
