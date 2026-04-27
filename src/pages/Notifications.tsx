import React from 'react';
import { AlertTriangle, CheckCircle, Banknote, CheckCheck, Zap, UserCircle, Eye, Clock, CreditCard, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../components/PageHeader';
import { MOCK_NOTIFICATIONS } from '../lib/mockData';

interface NotificationsPageProps {
  onViewScope?: (scope: any) => void;
}

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
export function NotificationsPage({ onViewScope }: NotificationsPageProps) {
  // --- BUSINESS LOGIC: NAVIGATION MAPPING ---
  // Transforms notification contextual data into a Scope object for viewing
  const handleNotificationClick = (notification: any) => {
    if (onViewScope && notification.category !== 'System Alerts') {
      let derivedStatus: 'Draft' | 'Sent' | 'Approved' | 'Paid' | 'Expired' | 'Completed' = 'Sent';
      
      if (notification.title.includes('Paid')) derivedStatus = 'Paid';
      else if (notification.title.includes('Approved')) derivedStatus = 'Approved';
      else if (notification.category === 'Deadline Approaching') derivedStatus = 'Expired';
      
      onViewScope({
        id: notification.title.match(/#(\d+)/)?.[1] || '1044',
        description: notification.title.split('#')[0] || notification.title,
        amount: '$1,200.00',
        time: notification.time,
        status: derivedStatus,
        client: 'Meridian Shipping'
      });
    }
  };

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

      <div className="max-w-4xl mx-auto grid grid-cols-1 gap-6">
        
        {/* FEED SECTION */}
        <div className="flex flex-col gap-6">
          <h3 className="font-label-caps text-secondary uppercase mb-2 tracking-wider">Recent Alerts</h3>
          
          {/* NOTIFICATION ITEM MAPPING */}
          {MOCK_NOTIFICATIONS.map(notification => {
            const Icon = notification.icon;
            return (
            <div 
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`bg-surface-container-lowest border rounded-xl p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 hover:bg-surface-container-low transition-colors duration-200 cursor-pointer relative overflow-hidden group shadow-sm ${
                notification.type === 'warning' ? 'border-error/30 bg-error-container/5' : 'border-surface-container-highest'
              }`}
            >
              {/* Visual indicator bar for warnings */}
              {notification.type === 'warning' && <div className="absolute left-0 top-0 bottom-0 w-1 bg-error"></div>}
              
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                notification.type === 'warning' ? 'bg-error-container text-on-error-container' : 
                notification.type === 'success' ? 'bg-primary-container text-on-primary-container' : 'bg-secondary-container text-on-secondary-container'
              }`}>
                <Icon className="w-6 h-6" />
              </div>
              
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row justify-between items-start mb-1 gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-secondary bg-surface-container px-2 py-0.5 rounded-full">{notification.category}</span>
                    <span className={`font-body-sm font-medium sm:hidden ${notification.type === 'warning' ? 'text-error' : 'text-secondary'}`}>
                      {notification.time}
                    </span>
                  </div>
                  <span className={`hidden sm:block font-body-sm font-medium ${notification.type === 'warning' ? 'text-error' : 'text-secondary'}`}>
                    {notification.time}
                  </span>
                </div>
                <h4 className="font-h3 text-on-surface mb-2">{notification.title}</h4>
                <p className="font-body-base text-on-surface-variant mb-4 leading-relaxed">
                  {notification.message}
                </p>
                <div className="flex gap-4">
                  <button className={`font-button px-4 py-2 rounded-lg transition-colors shadow-sm ${
                    notification.type === 'warning' ? 'bg-error text-on-primary hover:bg-on-error-container' : 
                    notification.type === 'success' ? 'bg-primary text-on-primary hover:bg-primary/90' :
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
          )})}
        </div>
      </div>
    </div>
  );
}
