import React from 'react';
import { Scope } from '../types';

interface StatusBadgeProps {
  status: Scope['status'];
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * REUSABLE COMPONENT: StatusBadge
 * 
 * Provides consistent styling for scope status across the application.
 * Centralizing this logic makes it easy to update colors or add new statuses globally.
 */
export function StatusBadge({ status, size = 'md', className = '' }: StatusBadgeProps) {
  const getStatusStyles = () => {
    switch (status) {
      case 'Completed':
        return 'bg-[#065F46] text-white shadow-sm';
      case 'Paid':
        return 'bg-green-500/20 text-green-700 dark:text-green-400';
      case 'Approved':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'Sent':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-500';
      case 'Expired':
        return 'bg-error/10 text-error';
      case 'Draft':
      default:
        return 'bg-surface-container text-secondary';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm': return 'px-1.5 py-0.5 text-[10px]';
      case 'lg': return 'px-2.5 py-1 text-xs';
      case 'md':
      default: return 'px-2 py-1 text-[11px]';
    }
  };

  return (
    <span className={`rounded font-bold uppercase tracking-wider inline-flex items-center justify-center whitespace-nowrap transition-colors ${getStatusStyles()} ${getSizeStyles()} ${className}`}>
      {status}
    </span>
  );
}
