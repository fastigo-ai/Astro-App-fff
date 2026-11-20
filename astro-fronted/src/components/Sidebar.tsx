'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  FileHeart,
  Video,
  PlayCircle,
  Users,
  LifeBuoy,
  LogOut,
  Sparkles,
  Baby,
} from 'lucide-react';
import { api } from '@/lib/api';

const NAV_ITEMS = [
  {
    label: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Courses & Duration',
    href: '/dashboard/courses',
    icon: BookOpen,
  },
  {
    label: 'Monthly & Daily Activities',
    href: '/dashboard/activities',
    icon: CalendarDays,
  },
  {
    label: 'Daily Care Notes',
    href: '/dashboard/care-notes',
    icon: FileHeart,
  },
  {
    label: 'Live Zoom Meetings',
    href: '/dashboard/live-zoom',
    icon: Video,
  },
  {
    label: 'Recorded Videos & LMS',
    href: '/dashboard/recorded',
    icon: PlayCircle,
  },
  {
    label: 'Users & Subscriptions',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    label: 'Support Tickets',
    href: '/dashboard/support',
    icon: LifeBuoy,
  },
  {
    label: 'Delivered Babies',
    href: '/dashboard/delivered-babies',
    icon: Baby,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = api.getStoredUser();

  const handleLogout = () => {
    api.clearAuth();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 min-h-screen flex flex-col border-r border-slate-800">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800 flex items-center space-x-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-saffron-600 to-amber-400 flex items-center justify-center shadow-lg shadow-saffron-900/50">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white leading-tight">AstroBaby</h1>
          <p className="text-xs text-amber-400 font-medium">Garbh Sanskar Admin</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-saffron-600 to-amber-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Current Admin Badge & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/60">
        <div className="flex items-center justify-between mb-3">
          <div className="truncate">
            <p className="text-xs text-slate-400">Signed in as</p>
            <p className="text-sm font-semibold text-slate-200 truncate">{user?.phone || 'Administrator'}</p>
          </div>
          <span
            className={`px-2 py-0.5 text-xs rounded-full font-semibold uppercase ${
              user?.role === 'super_admin'
                ? 'bg-purple-900/80 text-purple-200 border border-purple-500/40'
                : 'bg-amber-900/80 text-amber-200 border border-amber-500/40'
            }`}
          >
            {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/40 border border-red-900/40 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
