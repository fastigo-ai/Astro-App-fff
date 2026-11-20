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
  Edit2,
  X,
  Save,
  Sliders,
} from 'lucide-react';
import Header from '@/components/Header';
import { api } from '@/lib/api';

export default function CoursesListPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal State
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [editFormData, setEditFormData] = useState<any>({
    title: '',
    subtitle: '',
    bullet1: '',
    bullet2: '',
    bullet3: '',
    category: '',
    stage: 'pregnant',
    durationMonths: 6,
    price: 2499,
    originalPrice: 4499,
    taglinePill: '',
    showThoughtOfDay: true,
    showLiveSessions: true,
    showBrainupedia: true,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const loadCourses = async () => {
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
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const handleOpenEdit = (course: any) => {
    const highlights = course.cardHighlights || [];
    setEditingCourse(course);
    setSaveSuccessMsg(null);
    setEditFormData({
      title: course.title || '',
      subtitle: course.subtitle || '',
      bullet1: highlights[0] || '',
      bullet2: highlights[1] || '',
      bullet3: highlights[2] || '',
      category: course.category || 'Vedic Garbh Sanskar',
      stage: course.stage || 'pregnant',
      durationMonths: course.durationMonths || 6,
      price: course.pricing?.currentPrice || course.price || 2499,
      originalPrice: course.pricing?.originalPrice || course.originalPrice || 4499,
      taglinePill: course.experienceConfig?.taglinePill || '',
      showThoughtOfDay: course.experienceConfig?.widgets?.showThoughtOfDay ?? true,
      showLiveSessions: course.experienceConfig?.widgets?.showLiveSessions ?? true,
      showBrainupedia: course.experienceConfig?.widgets?.showBrainupedia ?? true,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCourse) return;

    try {
      setIsSaving(true);
      setSaveSuccessMsg(null);

      const cardHighlights = [editFormData.bullet1, editFormData.bullet2, editFormData.bullet3]
        .map((s) => String(s || '').trim())
        .filter(Boolean);

      const payload = {
        title: editFormData.title,
        subtitle: editFormData.subtitle,
        category: editFormData.category,
        stage: editFormData.stage,
        durationMonths: Number(editFormData.durationMonths),
        price: Number(editFormData.price),
        originalPrice: Number(editFormData.originalPrice),
        cardHighlights,
        taglinePill: editFormData.taglinePill,
        showThoughtOfDay: editFormData.showThoughtOfDay,
        showLiveSessions: editFormData.showLiveSessions,
        showBrainupedia: editFormData.showBrainupedia,
      };

      await api.updateCourse(editingCourse.id || editingCourse._id, payload);
      setSaveSuccessMsg('Course details updated successfully!');
      await loadCourses();
      setTimeout(() => {
        setEditingCourse(null);
        setSaveSuccessMsg(null);
      }, 700);
    } catch (err: any) {
      alert(err.message || 'Failed to update course');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 pb-12">
      <Header
        title="Courses & Programs"
        subtitle="Manage Garbh Sanskar curriculum tiers, durations, card contents, and mobile preview styling."
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
            <p className="font-bold">Dynamic Course Engine & Mobile Card Styling Active:</p>
            <p className="mt-0.5 text-amber-800">
              Card highlights configured here (e.g. <i>"Baby Planning"</i>, <i>"Natural Conception"</i>) dynamically shape the 2-column course selection boxes on the mobile app. Keep bullet text concise for optimal elegance.
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
            {courses.map((course) => {
              const highlights = course.cardHighlights || [];
              return (
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

                    {/* App Card Box Highlights Badge Preview */}
                    <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                        App Card Box Bullets:
                      </p>
                      {highlights.length > 0 ? (
                        <div className="space-y-1">
                          {highlights.map((h: string, idx: number) => (
                            <p key={idx} className="text-xs font-medium text-slate-700 flex items-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-saffron-500 mr-2 flex-shrink-0" />
                              <span className="truncate">{h}</span>
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs italic text-slate-400">Default presets active</p>
                      )}
                    </div>

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
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(course)}
                      className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition shadow-sm"
                    >
                      <Edit2 className="w-3.5 h-3.5 mr-1.5 text-saffron-600" /> Edit Details
                    </button>

                    <Link
                      href={`/dashboard/activities?courseId=${course.id}`}
                      className="inline-flex items-center text-xs font-bold text-saffron-700 hover:text-saffron-800"
                    >
                      <span>Curriculum</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Course Modal */}
      {editingCourse && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Edit Course Details</h3>
                <p className="text-xs text-slate-500">
                  Update course title, pricing, and short card highlights shown in the mobile app.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingCourse(null)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveSuccessMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-xl flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-600" />
                {saveSuccessMsg}
              </div>
            )}

            <form onSubmit={handleSaveEdit} className="space-y-5">
              {/* Title & Subtitle */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Course Title *</label>
                  <input
                    type="text"
                    required
                    value={editFormData.title}
                    onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={editFormData.subtitle}
                    onChange={(e) => setEditFormData({ ...editFormData, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
              </div>

              {/* Short App Card Box Highlights */}
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span className="text-xs font-bold text-amber-900">
                    App Card Box Content (Keep 2-3 words each):
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Card Bullet #1 *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.bullet1}
                      onChange={(e) => setEditFormData({ ...editFormData, bullet1: e.target.value })}
                      placeholder="e.g. Baby Planning"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Card Bullet #2 *</label>
                    <input
                      type="text"
                      required
                      value={editFormData.bullet2}
                      onChange={(e) => setEditFormData({ ...editFormData, bullet2: e.target.value })}
                      placeholder="e.g. Natural Conception"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Card Bullet #3 (Optional)</label>
                    <input
                      type="text"
                      value={editFormData.bullet3}
                      onChange={(e) => setEditFormData({ ...editFormData, bullet3: e.target.value })}
                      placeholder="e.g. Great Child"
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>
                </div>
              </div>

              {/* Category & Life Stage */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={editFormData.category}
                    onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  >
                    <option value="Vedic Garbh Sanskar">Vedic Garbh Sanskar</option>
                    <option value="Conception">Conception (गर्भाधान)</option>
                    <option value="Pregnancy">Pregnancy (गर्भावस्था)</option>
                    <option value="Newborn">Newborn (बाल संस्कार)</option>
                    <option value="Postpartum">Postpartum (शिशु देखभाल)</option>
                    <option value="Consultations">Consultations (भवितव्यम्)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Life Stage</label>
                  <select
                    value={editFormData.stage}
                    onChange={(e) => setEditFormData({ ...editFormData, stage: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  >
                    <option value="pregnant">Pregnant (गर्भवती)</option>
                    <option value="planning">Preconception / Planning (गर्भाधान)</option>
                    <option value="parenting">Newborn / Bal Sanskar (शिशु)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Months)</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={editFormData.durationMonths}
                    onChange={(e) => setEditFormData({ ...editFormData, durationMonths: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
              </div>

              {/* Pricing & Tagline */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={editFormData.price}
                    onChange={(e) => setEditFormData({ ...editFormData, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    value={editFormData.originalPrice}
                    onChange={(e) => setEditFormData({ ...editFormData, originalPrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tagline Pill</label>
                  <input
                    type="text"
                    value={editFormData.taglinePill}
                    onChange={(e) => setEditFormData({ ...editFormData, taglinePill: e.target.value })}
                    placeholder="e.g. मैं से माँ तक की आनंदमयी यात्रा"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setEditingCourse(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-saffron-600 to-amber-500 hover:from-saffron-500 hover:to-amber-400 text-white shadow-md shadow-saffron-900/20 flex items-center space-x-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
