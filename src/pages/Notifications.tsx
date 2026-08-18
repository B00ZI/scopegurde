import React from 'react';
import { CheckCheck, Bell, CheckCircle2, Eye, CreditCard, AlertTriangle, ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { MOCK_NOTIFICATIONS } from '../lib/mockData';

const ICON_MAP: Record<string, any> = {
  'check': CheckCircle2,
  'eye': Eye,
  'credit-card': CreditCard,
  'alert': AlertTriangle,
  'bell': Bell
};



/**
 * INBOX / NOTIFICATIONS PAGE
 * 
 * Purpose: A chronological feed of all business-critical events:
 * - Status Changes (Manual or Automatic)
 * - Client Activity (Viewed, Approved)
 * - Proactive Urgency Alerts (Expiring Scopes)
 * 
 * Flow:
 * - System emits events -> Appended to notification list
 * - User acts on them -> Redirected to relevant Scope or Client page
 */
export function NotificationsPage({ onSelectProject }: { onSelectProject?: (projectId: string) => void }) {
  return (
    <div className="max-w-container-max mx-auto pt-2 pb-8">
      {/* Header Injection */}
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

      <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6 px-4 sm:px-0">
        
        {/* FEED SECTION */}
        <div className="flex flex-col gap-6">
          <h3 className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em] mb-2">Recent Alerts</h3>
          
          {/* NOTIFICATION ITEM MAPPING */}
          {MOCK_NOTIFICATIONS.map(notification => {
            const Icon = ICON_MAP[notification.iconName] || Bell;
            return (
            <div 
              key={notification.id}
              className={`bg-surface-container-lowest border rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 hover:bg-surface-container-low transition-colors duration-200 relative overflow-hidden group shadow-sm ${
                notification.type === 'warning' ? 'border-error/30 bg-error-container/5' : 'border-surface-container-highest'
              }`}
            >
              {/* Visual indicator bar for warnings */}
              {notification.type === 'warning' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>}
              
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                notification.type === 'warning' ? 'bg-error-container text-on-error-container' : 
                notification.type === 'success' ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container-high text-on-surface'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1 w-full">
                <div className="flex flex-row justify-between items-start mb-2 gap-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-secondary bg-surface-container px-2 py-0.5 rounded-md">{notification.category}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${notification.type === 'warning' ? 'text-error' : 'text-outline/70'}`}>
                    {notification.time}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-bold text-on-surface mb-2 leading-tight">{notification.title}</h4>
                <p className="text-sm sm:text-base text-on-surface-variant mb-5 leading-relaxed">
                  {notification.message}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-auto">
                  <button
                    onClick={() => onSelectProject?.(notification.projectId)}
                    className={`w-full sm:w-auto font-bold px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 ${
                      notification.type === 'warning' ? 'bg-error text-on-primary hover:bg-error/90' : 
                      notification.type === 'success' ? 'bg-primary text-on-primary hover:bg-primary/90' :
                      'bg-surface-container-high text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    {notification.actionLabel}
                    {notification.projectId && <ArrowRight className="w-4 h-4" />}
                  </button>
                  {notification.type === 'warning' && (
                    <button className="w-full sm:w-auto font-bold text-error/80 hover:text-error hover:bg-error/5 py-2.5 rounded-xl transition-colors">Dismiss</button>
                  )}
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </div>
  );
}
