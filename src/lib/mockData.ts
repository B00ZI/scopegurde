import { Zap, UserCircle, Eye, Clock, CreditCard, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Client, Project, Scope } from '../types';

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
    progress: 65, 
    deadline: '2026-08-20', 
    pendingOutOfScopeRequests: 2 
  },
  { 
    id: 'PRJ-1002', 
    name: 'Last-Mile Routing Integration', 
    clientId: '2', 
    basePrice: 9600, 
    outOfScopeAdded: 0, 
    progress: 40, 
    deadline: '2026-09-15', 
    pendingOutOfScopeRequests: 0 
  },
  { 
    id: 'PRJ-1003', 
    name: 'Ocean Freight Portal', 
    clientId: '3', 
    basePrice: 12400, 
    outOfScopeAdded: 3150, 
    progress: 80, 
    deadline: '2026-08-17', 
    pendingOutOfScopeRequests: 1 
  },
  { 
    id: 'PRJ-1004', 
    name: 'Freight Rate Automation', 
    clientId: '4', 
    basePrice: 7800, 
    outOfScopeAdded: 1250, 
    progress: 25, 
    deadline: '2026-11-02', 
    pendingOutOfScopeRequests: 0 
  },
  { 
    id: 'PRJ-1005', 
    name: 'Express Tracking App', 
    clientId: '5', 
    basePrice: 14900, 
    outOfScopeAdded: 500, 
    progress: 15, 
    deadline: '2026-08-19', 
    pendingOutOfScopeRequests: 3 
  },
  { 
    id: 'PRJ-1006', 
    name: 'Acme Fleet Dashboard', 
    clientId: '1', 
    basePrice: 11200, 
    outOfScopeAdded: 0, 
    progress: 55, 
    deadline: '2026-10-05', 
    pendingOutOfScopeRequests: 0 
  }
];

export const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Scope #88211 Approved', message: 'Client Acme Corp has approved the redesign scope.', time: '2h ago', type: 'success', category: 'Approvals', unread: true, actionLabel: 'View Scope', iconName: 'check' },
  { id: '2', title: 'New Quote Requested # Nexus', message: 'Nexus Logistics is asking for a quote on cloud migration.', time: '4h ago', type: 'info', category: 'New Scopes', unread: true, actionLabel: 'Draft Scope', iconName: 'eye' },
  { id: '3', title: 'Payment Received #88213', message: 'Payment of $14,250.00 confirmed for Meridian Shipping.', time: 'Yesterday', type: 'success', category: 'Payments', unread: false, actionLabel: 'View Settlement', iconName: 'credit-card' },
  { id: '4', title: 'Scope #88215 Expired', message: 'Velocity Logistics scope has reached its expiration date.', time: '2 days ago', type: 'warning', category: 'Deadline Approaching', unread: true, actionLabel: 'Re-send', iconName: 'alert' }
];
