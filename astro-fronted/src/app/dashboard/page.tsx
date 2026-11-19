'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Users,
  Video,
  PlayCircle,
  BookOpen,
  LifeBuoy,
  Plus,
  ArrowRight,
  Calendar,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/Header';
import StatsCard from '@/components/StatsCard';
import { api } from '@/lib/api';
import { VEDIC_MONTH_MILESTONES } from '@/lib/constants';

export default function DashboardOverviewPage() {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const res = await api.getStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard metrics');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="flex-1 pb-12">
      <Header
        title="Admin & LMS Operations"
        subtitle="Manage Garbh Sanskar curriculum, daily Vedic practices, Zoom live webinars, and user subscriptions."
        actionButton={
          <div className="flex items-center space-x-2">
            <Link
              href="/dashboard/live-zoom"
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm transition"
            >
              <Video className="w-4 h-4 mr-1.5" /> Schedule Zoom
            </Link>
            <Link
              href="/dashboard/courses/create"
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-saffron-600 to-amber-500 hover:from-saffron-500 hover:to-amber-400 text-white shadow-md shadow-saffron-900/20 transition"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Create Course
            </Link>
          </div>
        }
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Welcome Vedic Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 border border-slate-800 p-8 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/30 text-amber-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Garbh Sanskar Holistic Curriculum Portal</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              AstroBaby Master LMS & Operations
            </h2>
            <p className="mt-2 text-slate-300 text-sm leading-relaxed">
              Empowering pregnant mothers with day-wise Vedic chanting, Garbh Samvad, cognitive brain stimulation games, prenatal yoga, and direct live doctor consultations inspired by Krishna Coming methodology.
            </p>
          </div>
        </div>

        {/* Operational Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatsCard
            title="Registered Mothers"
            value={loading ? '...' : stats.totalUsers || '0'}
            change="Active Parent Profiles"
            icon={Users}
            colorScheme="blue"
          />
          <StatsCard
            title="Active Subscriptions"
            value={loading ? '...' : stats.activeSubscriptions || '0'}
            change="Premium Subscribers"
            icon={BookOpen}
            colorScheme="emerald"
          />
          <StatsCard
            title="Upcoming Live Zoom Sessions"
            value={loading ? '...' : stats.upcomingClasses || '0'}
            change="Doctor & Guru Webinars"
            icon={Video}
            colorScheme="purple"
          />
          <StatsCard
            title="Recorded Masterclasses"
            value={loading ? '...' : stats.totalRecordedClasses || '0'}
            change="Video & Audio Archives"
            icon={PlayCircle}
            colorScheme="saffron"
          />
        </div>

        {/* Quick Management Shortcuts */}
        <div>
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center space-x-2">
            <span>Core Curriculum & Operations Modules</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Courses & Duration */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Courses & Dynamic Duration</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Configure programs (Sampurna Vedic, Aadhar, Bal Sanskar) and define pregnancy durations from Month 1 to 9.
              </p>
              <Link
                href="/dashboard/courses"
                className="inline-flex items-center text-xs font-bold text-amber-700 hover:text-amber-800"
              >
                <span>Manage Courses</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Monthly & Daily Activities */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Monthly & Daily Activities</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Publish 30-day schedules: Morning Shlokas, Garbh Samvad, Brain Games, Yoga, and Ayurvedic Diet recipes.
              </p>
              <Link
                href="/dashboard/activities"
                className="inline-flex items-center text-xs font-bold text-purple-700 hover:text-purple-800"
              >
                <span>Manage 30-Day Calendar</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>

            {/* Daily Care Notes */}
            <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-slate-900">Daily Care Notes & Guidelines</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                Do’s & Don’ts, hydration targets, doctor clinical notes, and father’s daily supportive guidelines.
              </p>
              <Link
                href="/dashboard/care-notes"
                className="inline-flex items-center text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                <span>Edit Daily Care Notes</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>

        {/* Vedic Trimester Milestone Reference */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Vedic 9-Month Fetal Development & Themes
              </h3>
              <p className="text-xs text-slate-500">
                Core syllabus blueprint aligned with classical Ayurvedic Garbh Sanskar texts.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {VEDIC_MONTH_MILESTONES.slice(0, 3).map((item) => (
              <div key={item.month} className="p-4 rounded-xl border border-amber-200 bg-amber-50/50">
                <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-amber-200 text-amber-900 mb-2">
                  Month {item.month} • Trimester {item.trimester}
                </span>
                <h5 className="font-bold text-sm text-slate-900">{item.sanskritName}</h5>
                <p className="text-xs font-medium text-amber-800 mt-0.5">{item.hindiTitle}</p>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">{item.fetalDevelopment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
