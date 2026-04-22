export interface Client {
  id: string;
  name: string;
  email: string;
  activeProjects: number;
  changeOrders: number;
  totalRevenue: number;
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
  status: 'draft' | 'pending' | 'approved' | 'declined';
  dateIssued: string;
  requestedBy: {
    name: string;
    role: string;
    avatar?: string;
  };
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
