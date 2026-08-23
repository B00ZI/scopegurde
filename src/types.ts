/**
 * GLOBAL TYPES
 * 
 * Defines the core data structures used across the application to ensure
 * consistency between UI components and mocked API data logic.
 */

export interface Client {
  id: string;
  name: string;
  email: string;
  contact: string;
  ongoingScopes: number;
  changeOrders: number;
  totalRevenue: number;
  industry?: string;
  lifetimeRevenue?: string | number;
  status: 'Active' | 'Inactive' | 'Archived' | string;
  avatar?: string;
}

export interface ChangeOrder {
  id: string;
  clientId: string;
  title: string;
  description: string;
  deliverables: string[];
  priceAdjustment: number;
  extraTimeDays: number;
  status: 'Draft' | 'Sent' | 'Approved' | 'Paid' | 'Expired' | 'Completed';
  dateIssued: string;
  requestedBy: {
    name: string;
    role: string;
    avatar?: string;
  };
}

export type Scope = ChangeOrder;

export type ProjectStatus = 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled' | 'Archived';

export interface Milestone {
  id: string;
  title: string;
  status: 'Todo' | 'InProgress' | 'Done';
  /** Optional per-milestone deadline. A milestone without one can never be overdue. */
  deadline?: string;
  description?: string;
  deliverables?: { id: string; text: string; done: boolean }[];
}

export interface Project {
  id: string;
  name: string;
  clientId: string;
  basePrice: number;
  outOfScopeAdded: number;
  milestones: Milestone[];
  /** Optional project deadline. If not set in the contract, it stays absent. */
  deadline?: string;
  pendingOutOfScopeRequests: number;
  status: ProjectStatus;
  createdAt: string;
  completedAt?: string;
}

export type ChangeRequestSource = 'Client' | 'Team' | 'AI-detected';

export type ChangeScopeDecision = 'In Scope' | 'Needs Review' | 'Out of Scope';

/** Request lifecycle: client asked → freelancer reviews → resolved. */
export type RequestStatus = 'Needs Review' | 'Reviewed' | 'Resolved';

/** Change proposal lifecycle: drafted → sent → client decides. */
export type ChangeRequestStatus = 'Draft' | 'Awaiting Client' | 'Approved' | 'Declined';

export interface ChangeRequest {
  id: string;
  projectId: string;
  title: string;
  description: string;
  source: ChangeRequestSource;
  scopeDecision: ChangeScopeDecision;
  dateRequested: string;

  /** Discriminant: is this a client request or a change proposal? */
  kind: 'request' | 'change';

  /** Request lifecycle status (only meaningful when kind === 'request'). */
  requestStatus?: RequestStatus;

  /** Change proposal lifecycle status (only meaningful when kind === 'change'). */
  status?: ChangeRequestStatus;

  /** Price adjustment proposed in a change proposal. */
  extraTimeDays: number;
  priceAdjustment: number;

  /** Client's answer, only present on changes once they decide. */
  clientDecision?: {
    date: string;
    reason?: string;
    note?: string;
  };

  /** On requests: id of the change proposal created from this request. */
  linkedChangeId?: string;
  /** On changes: id of the original request this change was created from. */
  linkedRequestId?: string;
}

export interface ContractSection {
  id: string;
  title: string;
  items: string[];
}

export interface Notification {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  message: string;
  time: string;
  unread: boolean;
  actionLabel?: string;
}

/** Things on the dashboard that require the freelancer to take action. */
export type AttentionType =
  | 'scope-decision'
  | 'change-proposal'
  | 'overdue-milestone';

export interface AttentionItem {
  id: string;
  projectId: string;
  type: AttentionType;
  /** Short human-readable description shown in the Details column. */
  details: string;
}

export type RoomSender = 'freelancer' | 'client';

export interface RoomMessage {
  id: string;
  projectId: string;
  sender: RoomSender;
  text: string;
  time: string;
}

export type ActivityType =
  | 'project-created'
  | 'milestone'
  | 'change-request'
  | 'scope-check'
  | 'client-decision'
  | 'request-submitted';

export interface ActivityEvent {
  id: string;
  projectId: string;
  type: ActivityType;
  title: string;
  description?: string;
  time: string;
}
