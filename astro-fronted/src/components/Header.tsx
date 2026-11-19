'use client';

import React from 'react';
import { Bell, ShieldCheck, Sparkles } from 'lucide-react';
import { api } from '@/lib/api';

interface HeaderProps {
  title: string;
  subtitle?: string;
  actionButton?: React.ReactNode;
}

export default function Header({ title, subtitle, actionButton }: HeaderProps) {
  const user = api.getStoredUser();

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-5 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 flex items-center space-x-2">
          <span>{title}</span>
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
            <Sparkles className="w-3 h-3 mr-1 text-amber-600" /> Vedic LMS
          </span>
        </h2>
        {subtitle && <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center space-x-4">
        {actionButton}

        <div className="flex items-center space-x-3 pl-4 border-l border-slate-200">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800">{user?.name || user?.phone || 'Admin'}</p>
            <p className="text-xs text-saffron-600 font-medium flex items-center justify-end">
              <ShieldCheck className="w-3 h-3 mr-1" />
              {user?.role === 'super_admin' ? 'Master Authority' : 'Operations Admin'}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
