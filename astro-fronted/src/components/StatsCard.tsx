import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  colorScheme?: 'saffron' | 'purple' | 'emerald' | 'blue';
}

const COLOR_MAP = {
  saffron: {
    bg: 'bg-saffron-50',
    iconBg: 'bg-saffron-100 text-saffron-700',
    border: 'border-saffron-200',
  },
  purple: {
    bg: 'bg-purple-50',
    iconBg: 'bg-purple-100 text-purple-700',
    border: 'border-purple-200',
  },
  emerald: {
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-100 text-emerald-700',
    border: 'border-emerald-200',
  },
  blue: {
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-100 text-blue-700',
    border: 'border-blue-200',
  },
};

export default function StatsCard({
  title,
  value,
  change,
  icon: Icon,
  colorScheme = 'saffron',
}: StatsCardProps) {
  const styles = COLOR_MAP[colorScheme];

  return (
    <div className={`p-5 rounded-2xl border ${styles.border} ${styles.bg} shadow-sm transition hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-600">{title}</p>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <p className="text-3xl font-extrabold text-slate-900">{value}</p>
        {change && <p className="text-xs font-semibold text-slate-500 mt-1">{change}</p>}
      </div>
    </div>
  );
}
