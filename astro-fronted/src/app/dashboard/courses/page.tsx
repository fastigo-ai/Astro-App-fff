'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Plus,
  Clock,
  CheckCircle,
  Eye,
  Trash2,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';
import Header from '@/components/Header';
import { api } from '@/lib/api';

export default function CoursesListPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        setLoading(true);
        const res = await api.listCourses();
        if (res.success && res.data) {
          setCourses(res.data);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch courses list');
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  return (
    <div className="flex-1 pb-12">
      <Header
        title="Courses & Programs"
        subtitle="Manage Garbh Sanskar curriculum tiers, durations, and month-wise lesson modules."
        actionButton={
          <Link
            href="/dashboard/courses/create"
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-saffron-600 to-amber-500 hover:from-saffron-500 hover:to-amber-400 text-white shadow-md shadow-saffron-900/20 transition"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Create New Course
          </Link>
        }
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Top Info Banner */}
        <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 flex items-start space-x-3">
          <Sparkles className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <p className="font-bold">Dynamic Duration Engine Active:</p>
            <p className="mt-0.5 text-amber-800">
              When a pregnant mother subscribes, AstroBaby automatically calculates her remaining months till delivery (`10 - current_month`) and provides dynamic pricing and custom daily activity calendars.
            </p>
          </div>
        </div>

        {/* Courses Table / Cards */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-sm font-semibold text-slate-500 animate-pulse">Loading Garbh Sanskar courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700">No courses found</h4>
            <p className="text-xs text-slate-400 mt-1">Get started by creating your first Garbh Sanskar course.</p>
            <Link
              href="/dashboard/courses/create"
              className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-saffron-600 text-white mt-4"
            >
              <Plus className="w-4 h-4 mr-1" /> Add Program
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id || course._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition"
              >
                <div className="p-6">
                  {/* Category & Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-saffron-100 text-saffron-800">
                      {course.category || 'Garbh Sanskar'}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1" /> Active
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 leading-snug">{course.title}</h4>
                  {course.subtitle && <p className="text-xs text-slate-500 mt-1">{course.subtitle}</p>}

                  {/* Highlights / Badges */}
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-slate-500">
                        <Clock className="w-4 h-4 mr-1 text-slate-400" /> Duration:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {course.durationMonths ? `${course.durationMonths} Months` : 'Dynamic (Month 1-9)'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center text-slate-500">
                        <Layers className="w-4 h-4 mr-1 text-slate-400" /> Lessons:
                      </span>
                      <span className="font-semibold text-slate-800">
                        {course.lessonsCount || course.totalLessons || '30+ Daily Activities'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Life Stage:</span>
                      <span className="font-semibold capitalize text-purple-700 bg-purple-50 px-2 py-0.5 rounded">
                        {course.stage || 'pregnant'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">
                    {course.price ? `₹${course.price}` : 'Dynamic Tier'}
                  </span>
                  <Link
                    href={`/dashboard/activities?courseId=${course.id}`}
                    className="inline-flex items-center text-xs font-bold text-saffron-700 hover:text-saffron-800"
                  >
                    <span>View Curriculum</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
