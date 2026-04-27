import { Client, Scope } from '../types';

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
    lifetimeRevenue: '$12,850',
    status: 'Active',
    avatar: 'https://picsum.photos/seed/nexus/100/100'
  }
];

export const MOCK_SCOPES: Scope[] = [
  { 
    id: '88211', 
    description: 'Website Redesign Phase 1', 
    client: 'Acme Corp', 
    amount: '$1,250.00', 
    status: 'Approved', 
    dateIssued: '2026-04-25',
    validUntil: '2026-05-10',
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
    deliverables: ['Support Hours', 'Maintenance'],
    priceAdjustment: 0,
    extraTimeDays: 0,
    requestedBy: { name: 'Admin', role: 'Account Manager', email: 'admin@scopeguard.com' }
  }
];

export const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Scope #88211 Approved', time: '2h ago', type: 'success', category: 'Approvals' },
  { id: '2', title: 'New Quote Requested # Nexus', time: '4h ago', type: 'info', category: 'New Scopes' },
  { id: '3', title: 'Payment Received #88213', time: 'Yesterday', type: 'success', category: 'Payments' },
  { id: '4', title: 'Scope #88215 Expired', time: '2 days ago', type: 'error', category: 'Deadline Approaching' }
];
