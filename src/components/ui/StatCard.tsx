import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon: LucideIcon;
  badge?: string;
  color?: string;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  icon: Icon,
  badge,
  color = 'text-blue-500',
  onClick
}) => {
  const baseClasses = `w-full text-left relative overflow-hidden rounded-2xl bg-white dark:bg-[#18181B] border border-neutral-200 dark:border-neutral-800 p-5 shadow-xs transition duration-200 hover:shadow-md ${
    onClick
      ? 'cursor-pointer hover:border-neutral-400 dark:hover:border-neutral-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500'
      : ''
  }`;

  const inner = (
    <>
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
          {label}
        </span>
        <div className={`p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800/80 shrink-0 ${color}`}>
          <Icon className="w-4 h-4 text-current" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight tabular-nums text-neutral-900 dark:text-neutral-100">
          {value}
        </div>
        <div className="mt-1 flex items-center justify-between gap-2">
          {subtext && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
              {subtext}
            </p>
          )}
          {badge && (
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900 whitespace-nowrap shrink-0">
              {badge}
            </span>
          )}
        </div>
      </div>
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={baseClasses}>
        {inner}
      </button>
    );
  }

  return <div className={baseClasses}>{inner}</div>;
};
