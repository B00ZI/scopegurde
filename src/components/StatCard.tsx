import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  key?: string | number;
  label: string;
  value: string;
  trend?: string;
  icon: LucideIcon;
  color?: string;
  onClick?: () => void;
}

/**
 * REUSABLE COMPONENT: StatCard
 * 
 * Displays a single metric with an icon and optional trend indicators.
 * Used primarily in Dashboard and page headers.
 */
export function StatCard({ label, value, trend, icon: Icon, color, onClick }: StatCardProps) {
  const isClickable = !!onClick;
  
  return (
    <div 
      onClick={onClick}
      className={`relative overflow-hidden bg-surface-container-lowest border rounded-xl p-5 shadow-sm transition-all duration-200 ${
        isClickable 
          ? 'cursor-pointer border-surface-container-highest hover:border-primary/30 hover:shadow-md hover:bg-surface-container-low group' 
          : 'border-surface-container-highest'
      }`}
    >
      <div className="relative z-10 flex items-center justify-between mb-3">
        <h3 className="text-xs font-semibold text-secondary uppercase tracking-wider">{label}</h3>
      </div>
      <div className="relative z-10 flex items-baseline gap-2 mt-1">
        <p className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight truncate" title={value}>{value}</p>
        {trend && (
          <span className={`text-xs font-medium ${
            trend.startsWith('+') || trend.includes('7d') || trend === 'High' 
              ? (color ? color : 'text-[#065F46] dark:text-[#10B981]') 
              : 'text-secondary'
          }`}>
            {trend}
          </span>
        )}
      </div>
      {/* Background Stylized Icon */}
      <Icon className={`absolute -right-2 -bottom-4 w-24 h-24 opacity-[0.06] dark:opacity-[0.08] transition-transform duration-300 ${color || 'text-primary'}`} />
    </div>
  );
}
