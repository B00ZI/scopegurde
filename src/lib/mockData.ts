import { Zap, UserCircle, Eye, Clock, CreditCard, CheckCircle2, AlertTriangle } from 'lucide-react';
import { AttentionItem, ChangeRequest, Client, ContractSection, Project, Scope } from '../types';

/**
 * MOCK DATA REPOSITORY
 * 
 * Centralized mock data for consistent use across the application.
 * In a production app, these would be fetched from an API.
 */

export const MOCK_CLIENTS: Client[] = [
  { 
    id: '1', 
    name: 'Acme Corp', 
    industry: 'Logistics', 
    contact: 'John Smith', 
    email: 'john@acmecorp.com',
    ongoingScopes: 3,
    changeOrders: 2,
    totalRevenue: 45200,
    lifetimeRevenue: '$45,200',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/acme/100/100'
  },
  { 
    id: '2', 
    name: 'Nexus Logistics', 
    industry: 'Last Mile', 
    contact: 'Sarah Jenkins', 
    email: 'sarah@nexus.io',
    ongoingScopes: 1,
    changeOrders: 5,
    totalRevenue: 12850,
    lifetimeRevenue: '$12,850',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/nexus/100/100'
  },
  { 
    id: '3', 
    name: 'Meridian Shipping', 
    industry: 'Ocean Freight', 
    contact: 'Tom Alvarez', 
    email: 'tom@meridianshipping.com',
    ongoingScopes: 2,
    changeOrders: 1,
    totalRevenue: 21400,
    lifetimeRevenue: '$21,400',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/meridian/100/100'
  },
  { 
    id: '4', 
    name: 'Global Partners', 
    industry: 'Freight Forwarding', 
    contact: 'Priya Nair', 
    email: 'priya@globalpartners.co',
    ongoingScopes: 1,
    changeOrders: 3,
    totalRevenue: 9300,
    lifetimeRevenue: '$9,300',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/global/100/100'
  },
  { 
    id: '5', 
    name: 'Velocity Logistics', 
    industry: 'Express Delivery', 
    contact: 'Marcus Lee', 
    email: 'marcus@velocitylogistics.com',
    ongoingScopes: 1,
    changeOrders: 0,
    totalRevenue: 7600,
    lifetimeRevenue: '$7,600',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/velocity/100/100'
  }
];

export const MOCK_SCOPES: any[] = [
  { 
    id: '88211', 
    description: 'Website Redesign Phase 1', 
    client: 'Acme Corp', 
    amount: '$1,250.00', 
    status: 'Approved', 
    dateIssued: '2026-04-25',
    validUntil: '2026-05-10',
    time: '2h ago',
    deliverables: ['UI/UX Design', 'Frontend Implementation'],
    priceAdjustment: 0,
    extraTimeDays: 0,
    requestedBy: { name: 'Admin', role: 'Account Manager', email: 'admin@scopeguard.com' }
  },
  { 
    id: '88212', 
    description: 'Mobile App Asset Optimization', 
    client: 'Nexus Logistics', 
    amount: '$850.00', 
    status: 'Draft', 
    dateIssued: '2026-04-26',
    validUntil: '2026-04-30',
    time: '4h ago',
    deliverables: ['Asset Compression', 'S3 Setup'],
    priceAdjustment: 0,
    extraTimeDays: 0,
    requestedBy: { name: 'Admin', role: 'Account Manager', email: 'admin@scopeguard.com' }
  },
  { 
    id: '88213', 
    description: 'Priority Fuel Surcharge Q2', 
    client: 'Meridian Shipping', 
    amount: '$14,250.00', 
    status: 'Paid', 
    dateIssued: '2026-04-20',
    time: 'Yesterday',
    deliverables: ['Fuel Analysis', 'Q2 Report'],
    priceAdjustment: 0,
    extraTimeDays: 0,
    requestedBy: { name: 'Admin', role: 'Account Manager', email: 'admin@scopeguard.com' }
  },
  { 
    id: '88214', 
    description: 'API Integration Support', 
    client: 'Global Partners', 
    amount: '$2,100.00', 
    status: 'Sent', 
    dateIssued: '2026-04-24',
    validUntil: '2026-05-05',
    time: '3 days ago',
    deliverables: ['Webhook Setup', 'OAuth Implementation'],
    priceAdjustment: 0,
    extraTimeDays: 0,
    requestedBy: { name: 'Admin', role: 'Account Manager', email: 'admin@scopeguard.com' }
  },
  { 
    id: '88215', 
    description: 'Monthly Retainer May', 
    client: 'Velocity Logistics', 
    amount: '$5,000.00', 
    status: 'Expired', 
    dateIssued: '2026-04-15',
    validUntil: '2026-04-25',
    time: '5 days ago',
    deliverables: ['Support Hours', 'Maintenance'],
    priceAdjustment: 0,
    extraTimeDays: 0,
    requestedBy: { name: 'Admin', role: 'Account Manager', email: 'admin@scopeguard.com' }
  }
];

export const MOCK_PROJECTS: Project[] = [
  { 
    id: 'PRJ-1001', 
    name: 'Q3 Hub Rebuild', 
    clientId: '1', 
    basePrice: 18500, 
    outOfScopeAdded: 2400, 
    deadline: '2026-08-20', 
    pendingOutOfScopeRequests: 2,
    status: 'In Progress',
    createdAt: '2026-05-18',
    milestones: [
      { 
        id: 'M1', 
        title: 'Discovery & Research', 
        status: 'Done',
        description: 'Kickoff, stakeholder interviews and a UX audit of the existing hub.',
        deliverables: ['Stakeholder interviews', 'Competitor & UX audit', 'Sitemap v1'],
      },
      { 
        id: 'M2', 
        title: 'Wireframes', 
        status: 'Done',
        description: 'Low- and high-fidelity wireframes for the main flows.',
        deliverables: ['Homepage wireframes', 'Inner page wireframes', 'Approved click-through'],
      },
      { 
        id: 'M3', 
        title: 'Brand guidelines', 
        status: 'Done',
        description: 'Refresh the brand guidelines and apply them to the new templates.',
        deliverables: ['Updated type scale', 'Color tokens', 'Component styles'],
      },
      { 
        id: 'M4', 
        title: 'Homepage design', 
        status: 'InProgress', 
        deadline: '2026-08-12',
        description: 'Design and build the new homepage plus the four inner pages.',
        deliverables: ['Homepage design', '4 inner page designs'],
      },
      { 
        id: 'M5', 
        title: 'QA & Launch', 
        status: 'Todo',
        description: 'Cross-browser QA, accessibility pass and launch.',
        deliverables: ['Accessibility audit', 'Cross-browser QA', 'Launch checklist'],
      },
    ],
  },
  { 
    id: 'PRJ-1002', 
    name: 'Last-Mile Routing Integration', 
    clientId: '2', 
    basePrice: 9600, 
    outOfScopeAdded: 0, 
    deadline: '2026-09-15', 
    pendingOutOfScopeRequests: 0,
    status: 'In Progress',
    createdAt: '2026-06-02',
    milestones: [
      { id: 'M1', title: 'Route data ingestion', status: 'Done' },
      { id: 'M2', title: 'Geocoding service', status: 'Done' },
      { id: 'M3', title: 'Admin dashboard', status: 'InProgress' },
      { id: 'M4', title: 'Dispatch UI', status: 'Todo' },
      { id: 'M5', title: 'Real-time tracking', status: 'Todo' },
      { id: 'M6', title: 'Driver app', status: 'Todo' },
      { id: 'M7', title: 'Go-live', status: 'Todo' },
    ],
  },
  { 
    id: 'PRJ-1003', 
    name: 'Ocean Freight Portal', 
    clientId: '3', 
    basePrice: 12400, 
    outOfScopeAdded: 3150, 
    deadline: '2026-08-17', 
    pendingOutOfScopeRequests: 1,
    status: 'In Progress',
    createdAt: '2026-05-27',
    milestones: [
      { id: 'M1', title: 'Requirements', status: 'Done' },
      { id: 'M2', title: 'Portal design', status: 'Done' },
      { id: 'M3', title: 'Booking flow', status: 'Done' },
      { id: 'M4', title: 'Invoicing module', status: 'InProgress' },
    ],
  },
  { 
    id: 'PRJ-1004', 
    name: 'Freight Rate Automation', 
    clientId: '4', 
    basePrice: 7800, 
    outOfScopeAdded: 1250, 
    deadline: '2026-11-02', 
    pendingOutOfScopeRequests: 0,
    status: 'On Hold',
    createdAt: '2026-06-20',
    milestones: [
      { id: 'M1', title: 'Research', status: 'Done' },
      { id: 'M2', title: 'Rate engine', status: 'Todo' },
      { id: 'M3', title: 'API integration', status: 'Todo' },
      { id: 'M4', title: 'Testing', status: 'Todo' },
    ],
  },
  { 
    id: 'PRJ-1005', 
    name: 'Express Tracking App', 
    clientId: '5', 
    basePrice: 14900, 
    outOfScopeAdded: 500, 
    deadline: '2026-08-19', 
    pendingOutOfScopeRequests: 3,
    status: 'In Progress',
    createdAt: '2026-06-11',
    milestones: [
      { id: 'M1', title: 'Discovery', status: 'Done' },
      { id: 'M2', title: 'Tracking UI', status: 'InProgress', deadline: '2026-08-10' },
      { id: 'M3', title: 'Notifications', status: 'Todo' },
      { id: 'M4', title: 'Live map', status: 'Todo' },
      { id: 'M5', title: 'Beta test', status: 'Todo' },
      { id: 'M6', title: 'Launch', status: 'Todo' },
    ],
  },
  { 
    id: 'PRJ-1006', 
    name: 'Acme Fleet Dashboard', 
    clientId: '1', 
    basePrice: 11200, 
    outOfScopeAdded: 0, 
    deadline: '2026-10-05', 
    pendingOutOfScopeRequests: 0,
    status: 'In Progress',
    createdAt: '2026-07-08',
    milestones: [
      { id: 'M1', title: 'Fleet data model', status: 'Done' },
      { id: 'M2', title: 'Dashboard wireframe', status: 'Done' },
      { id: 'M3', title: 'Telemetry feed', status: 'InProgress' },
      { id: 'M4', title: 'Admin views', status: 'Todo' },
    ],
  },
  { 
    id: 'PRJ-1007', 
    name: 'Global Partners Web Portal', 
    clientId: '4', 
    basePrice: 9800, 
    outOfScopeAdded: 800, 
    deadline: '2026-08-01', 
    pendingOutOfScopeRequests: 0,
    status: 'Completed',
    createdAt: '2026-04-15',
    completedAt: '2026-08-12',
    milestones: [
      { id: 'M1', title: 'Design', status: 'Done' },
      { id: 'M2', title: 'Build', status: 'Done' },
      { id: 'M3', title: 'Content', status: 'Done' },
      { id: 'M4', title: 'Launch', status: 'Done' },
    ],
  },
  { 
    id: 'PRJ-1008', 
    name: 'Nexus API Onboarding', 
    clientId: '2', 
    basePrice: 5200, 
    outOfScopeAdded: 400, 
    deadline: '2026-08-06', 
    pendingOutOfScopeRequests: 0,
    status: 'Completed',
    createdAt: '2026-06-24',
    completedAt: '2026-08-05',
    milestones: [
      { id: 'M1', title: 'Key setup', status: 'Done' },
      { id: 'M2', title: 'Integration', status: 'Done' },
      { id: 'M3', title: 'Handover', status: 'Done' },
    ],
  },
  { 
    id: 'PRJ-1009', 
    name: 'Meridian Rate Card Refresh', 
    clientId: '3', 
    basePrice: 4200, 
    outOfScopeAdded: 0, 
    deadline: '2026-07-15', 
    pendingOutOfScopeRequests: 0,
    status: 'Cancelled',
    createdAt: '2026-05-30',
    milestones: [
      { id: 'M1', title: 'Rate analysis', status: 'Done' },
      { id: 'M2', title: 'New card build', status: 'Todo' },
      { id: 'M3', title: 'Client sign-off', status: 'Todo' },
    ],
  },
  { 
    id: 'PRJ-1010', 
    name: 'Acme Onboarding Portal', 
    clientId: '1', 
    basePrice: 6800, 
    outOfScopeAdded: 0, 
    deadline: '2026-03-01', 
    pendingOutOfScopeRequests: 0,
    status: 'Archived',
    createdAt: '2025-11-10',
    milestones: [
      { id: 'M1', title: 'Scoping', status: 'Done' },
      { id: 'M2', title: 'Build', status: 'Done' },
      { id: 'M3', title: 'Handover', status: 'Done' },
    ],
  }
];

export const MOCK_CHANGE_REQUESTS: ChangeRequest[] = [
  {
    id: 'CR-1',
    projectId: 'PRJ-1001',
    title: 'Dark mode',
    description: 'Add a dark theme across the public hub and the new dashboard templates.',
    source: 'Client',
    scopeDecision: 'Out of Scope',
    status: 'Pending',
    extraTimeDays: 3,
    priceAdjustment: 1200,
    dateRequested: '2026-08-10',
  },
  {
    id: 'CR-2',
    projectId: 'PRJ-1002',
    title: 'Admin dashboard',
    description: 'Extra screen to manage routes and dispatchers from a single view.',
    source: 'Client',
    scopeDecision: 'In Scope',
    status: 'Sent',
    extraTimeDays: 4,
    priceAdjustment: 1800,
    dateRequested: '2026-08-11',
  },
  {
    id: 'CR-3',
    projectId: 'PRJ-1001',
    title: 'Spanish translations',
    description: 'The new pages mention translations into Spanish (ES-MX) that are not listed in the contract.',
    source: 'AI-detected',
    scopeDecision: 'Needs Review',
    status: 'Pending',
    extraTimeDays: 2,
    priceAdjustment: 600,
    dateRequested: '2026-08-12',
  },
  {
    id: 'CR-4',
    projectId: 'PRJ-1001',
    title: 'Onboarding email sequence',
    description: 'Three automated emails when a client creates an account.',
    source: 'Client',
    scopeDecision: 'In Scope',
    status: 'Accepted',
    extraTimeDays: 1,
    priceAdjustment: 350,
    dateRequested: '2026-08-09',
    clientDecision: { date: '2026-08-12' },
  },
  {
    id: 'CR-6',
    projectId: 'PRJ-1001',
    title: 'Sticky nav redesign',
    description: 'Rework the sticky navigation into a floating pill layout across all pages.',
    source: 'Client',
    scopeDecision: 'Out of Scope',
    status: 'Rejected',
    extraTimeDays: 1,
    priceAdjustment: 450,
    dateRequested: '2026-08-07',
    clientDecision: {
      date: '2026-08-10',
      reason: 'Want something different',
      note: 'We\u2019ll decide after seeing the homepage direction.',
    },
  },
  {
    id: 'CR-5',
    projectId: 'PRJ-1003',
    title: 'API rate limit doubling',
    description: 'Double the rate limits on the public booking API.',
    source: 'Client',
    scopeDecision: 'Out of Scope',
    status: 'Rejected',
    extraTimeDays: 2,
    priceAdjustment: 900,
    dateRequested: '2026-08-08',
    clientDecision: {
      date: '2026-08-11',
      reason: 'Too expensive',
      note: 'We\u2019ll revisit this next quarter.',
    },
  },
];

export const MOCK_CONTRACT_SECTIONS: ContractSection[] = [
  {
    id: 'sec-1',
    title: 'Payment Terms',
    items: [
      '50% upfront before kickoff',
      '25% on homepage design approval',
      '25% on launch',
    ],
  },
  {
    id: 'sec-2',
    title: 'Rules',
    items: [
      'Changes outside the agreed work are quoted before work starts',
      'Up to 2 revision rounds per deliverable',
      'Responses within 24h on business days',
    ],
  },
  {
    id: 'sec-3',
    title: 'Agreed Work',
    items: [
      'Homepage plus 4 inner pages',
      'Brand guidelines applied to every page',
      'Responsive and WCAG AA accessible',
      'Basic SEO per page',
    ],
  },
  {
    id: 'sec-4',
    title: 'Other Terms',
    items: [
      'Code ownership transfers on final payment',
      '3 months of free post-launch support',
      'Out-of-scope work is always quoted separately',
    ],
  },
];

export const CLIENT_ROOM_TOKENS: Record<string, string> = {
  'PRJ-1001': 'K4xq9vN2R8tM',
  'PRJ-1002': 'p7Qw2Lx9Fd3H',
  'PRJ-1003': 'Rt6Zj5Kc2Wm8',
};

export const MOCK_ORIGINAL_CONTRACT: Record<string, string> = {
  'PRJ-1001': `Acme Corp — Website Rebuild Agreement

This agreement covers the redesign and rebuild of the Acme Corp public hub and its supporting pages, based on the approved brand guidelines.

Deliverables
1. Homepage.
2. Four inner pages (services, pricing, support, contact).
3. Brand guidelines applied across all new templates.
4. Responsive layout and WCAG AA accessibility.

Payment Terms
50% upfront before kickoff. 25% on approval of the homepage design. 25% on launch.

Timeline
Twelve weeks from the kickoff date. Milestones are marked as done only after delivery and client review.

Revisions
Up to two revision rounds per deliverable. Additional rounds are quoted separately.

Out-of-Scope Work
Any work not listed above is out of scope and is quoted before it is started. Work never begins without written client approval.`,
};

export const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Scope #88211 Approved', message: 'Client Acme Corp has approved the redesign scope.', time: '2h ago', type: 'success', category: 'Approvals', unread: true, actionLabel: 'View Scope', iconName: 'check' },
  { id: '2', title: 'New Quote Requested # Nexus', message: 'Nexus Logistics is asking for a quote on cloud migration.', time: '4h ago', type: 'info', category: 'New Scopes', unread: true, actionLabel: 'Draft Scope', iconName: 'eye' },
  { id: '3', title: 'Payment Received #88213', message: 'Payment of $14,250.00 confirmed for Meridian Shipping.', time: 'Yesterday', type: 'success', category: 'Payments', unread: false, actionLabel: 'View Settlement', iconName: 'credit-card' },
  { id: '4', title: 'Scope #88215 Expired', message: 'Velocity Logistics scope has reached its expiration date.', time: '2 days ago', type: 'warning', category: 'Deadline Approaching', unread: true, actionLabel: 'Re-send', iconName: 'alert' }
];

/**
 * DASHBOARD ATTENTION ITEMS
 *
 * Only things that require the freelancer to act. A change request waiting
 * on the client, normal deadlines, or general info must NOT be listed here.
 */
export const MOCK_ATTENTION_ITEMS: AttentionItem[] = [
  {
    id: 'ATT-1',
    projectId: 'PRJ-1001',
    type: 'scope-decision',
    details: 'Client requested "Dark mode"',
  },
  {
    id: 'ATT-2',
    projectId: 'PRJ-1002',
    type: 'change-proposal',
    details: 'Admin dashboard',
  },
  {
    id: 'ATT-3',
    projectId: 'PRJ-1001',
    type: 'overdue-milestone',
    details: 'Homepage design · Due Aug 12',
  },
  {
    id: 'ATT-4',
    projectId: 'PRJ-1005',
    type: 'overdue-milestone',
    details: 'Tracking UI · Due Aug 10',
  },
];
