import { AlertTriangle, CheckCircle, Banknote, CheckCheck, Activity, RefreshCw } from 'lucide-react';
import { Notification } from '../types';
import { PageHeader } from '../components/PageHeader';

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'warning',
    title: 'New scope creep detected in Nexus Design project',
    message: 'Automated analysis flagged a 15% deviation from the original contract parameters concerning freight dimensions. Immediate review required to mitigate surcharge absorption.',
    time: '10 min ago',
    unread: true,
    actionLabel: 'Review Deviation'
  },
  {
    id: '2',
    type: 'success',
    title: 'Client Axiom Logistics approved Scope #88492',
    message: 'Digital signature verified. The updated surcharge schedule for Q3 routing has been fully executed and is now active in the billing system.',
    time: '2 hours ago',
    unread: true,
    actionLabel: 'View Document'
  },
  {
    id: '3',
    type: 'info',
    title: 'Surcharge reconciliation payment received',
    message: 'Wire transfer of $14,250.00 from Meridian Shipping has cleared. This resolves the outstanding dispute for Route B surcharges.',
    time: 'Yesterday, 4:30 PM',
    unread: false,
    actionLabel: 'View Ledger'
  }
];

export function NotificationsPage() {
  return (
    <div className="max-w-container-max mx-auto py-8">
      <PageHeader 
        title="Inbox" 
        subtitle="You have 2 unread items requiring attention."
        border
        actions={
          <button className="font-button text-primary bg-surface-container-lowest border border-surface-container-highest hover:border-primary hover:bg-surface-container-low px-4 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap">
            <CheckCheck className="w-4 h-4" />
            Mark all as read
          </button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-8 flex flex-col gap-6">
          <h3 className="font-label-caps text-secondary uppercase mb-2 tracking-wider">Today</h3>
          {MOCK_NOTIFICATIONS.filter(n => n.id !== '3').map(notification => (
            <div 
              key={notification.id}
              className={`bg-surface-container-lowest border rounded-xl p-6 flex items-start gap-6 hover:bg-surface-container-low transition-all duration-200 cursor-pointer relative overflow-hidden group ${
                notification.type === 'warning' ? 'border-error/30 bg-error-container/5' : 'border-surface-container-highest'
              }`}
            >
              {notification.type === 'warning' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>}
              
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                notification.type === 'warning' ? 'bg-error-container text-on-error-container' : 
                notification.type === 'success' ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'
              }`}>
                {notification.type === 'warning' ? <AlertTriangle className="w-6 h-6" /> : 
                 notification.type === 'success' ? <CheckCircle className="w-6 h-6" /> : <Banknote className="w-6 h-6" />}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-h3 text-on-surface">{notification.title}</h4>
                  <span className={`font-body-sm font-medium ${notification.type === 'warning' ? 'text-error' : 'text-secondary'}`}>
                    {notification.time}
                  </span>
                </div>
                <p className="font-body-base text-on-surface-variant mb-4 leading-relaxed">
                  {notification.message}
                </p>
                <div className="flex gap-4">
                  <button className={`font-button px-4 py-2 rounded-lg transition-colors ${
                    notification.type === 'warning' ? 'bg-error text-on-primary hover:bg-on-error-container' : 
                    'text-primary border border-primary hover:bg-primary hover:text-on-primary'
                  }`}>
                    {notification.actionLabel}
                  </button>
                  {notification.type === 'warning' && (
                    <button className="font-button text-secondary hover:text-on-surface px-4 py-2">Dismiss</button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <h3 className="font-label-caps text-secondary uppercase mt-6 mb-2 tracking-wider">Yesterday</h3>
          <div className="bg-surface-container-lowest border border-surface-container-highest rounded-xl p-6 flex items-start gap-6 hover:bg-surface-container-low transition-colors duration-200 cursor-pointer opacity-80 hover:opacity-100">
            <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center shrink-0">
              <Banknote className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-h3 text-on-surface">Surcharge reconciliation payment received</h4>
                <span className="font-body-sm text-secondary">Yesterday, 4:30 PM</span>
              </div>
              <p className="font-body-base text-on-surface-variant mb-4 leading-relaxed">
                Wire transfer of $14,250.00 from Meridian Shipping has cleared. This resolves the outstanding dispute for Route B surcharges.
              </p>
              <div className="flex gap-4">
                <button className="font-button text-secondary border border-surface-container-highest px-4 py-2 rounded-lg hover:bg-surface-container-highest transition-colors">
                  View Ledger
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-4 flex flex-col gap-6">
          <div className="bg-surface-container-low border border-surface-container-highest rounded-xl p-6">
            <h3 className="font-h3 text-on-surface mb-6">System Health</h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="font-body-base text-on-surface-variant">API Sync</span>
                <span className="font-body-sm text-primary flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Operational
                </span>
              </div>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                <div className="bg-primary w-full h-full"></div>
              </div>
              
              <div className="flex items-center justify-between mt-2">
                <span className="font-body-base text-on-surface-variant">Carrier Data Feeds</span>
                <span className="font-body-sm text-secondary flex items-center gap-1">
                  <RefreshCw className="w-4 h-4 animate-spin" /> Syncing...
                </span>
              </div>
              <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
                <div className="bg-secondary w-3/4 h-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
