'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Sparkles, BookOpen, Sliders, UserCheck, Layers } from 'lucide-react';
import Header from '@/components/Header';
import { api } from '@/lib/api';

export default function CreateCoursePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    bullet1: '',
    bullet2: '',
    bullet3: '',
    overview: '',
    category: 'Vedic Garbh Sanskar',
    stage: 'pregnant',
    durationMonths: 6,
    price: 2499,
    originalPrice: 4499,
    // Mobile App Screen Dynamic Experience Config
    taglinePill: '',
    timelineMode: 'pregnancy_months',
    timelineLabel: 'Pregnancy Month',
    showMentorBanner: true,
    classTitle: '',
    mentorName: 'Prof. Vipin Joshi',
    mentorSubtitle: 'Course Masterclass',
    activityCardTitle: '',
    activityCardTitleBig: 'Activities',
    activityCardSub: 'of this Month',
    showThoughtOfDay: true,
    showLiveSessions: true,
    showBrainupedia: true,
    showAudioLibrary: true,
    showTools: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.title.trim()) {
      setError('Course title is required');
      return;
    }

    try {
      setLoading(true);
      const cardHighlights = [formData.bullet1, formData.bullet2, formData.bullet3]
        .map((s) => s.trim())
        .filter(Boolean);

      await api.createCourse({
        ...formData,
        cardHighlights,
      });
      router.push('/dashboard/courses');
    } catch (err: any) {
      setError(err.message || 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 pb-12">
      <Header
        title="Create Course & Define Duration"
        subtitle="Set up a new Garbh Sanskar curriculum, assign trimester duration, and configure pricing tiers."
        actionButton={
          <Link
            href="/dashboard/courses"
            className="inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Courses
          </Link>
        }
      />

      <div className="p-8 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Title & Subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Program Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Sampurna Vedic Garbh Sanskar"
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Subtitle / Tagline
              </label>
              <input
                type="text"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g. Complete 9-Month Holistic Journey till Delivery"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>
          </div>

          {/* Photo URL & Short App Card Bullet Highlights */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200/80 text-xs text-blue-900">
              <span className="font-bold">App Card Box Contents:</span> Keep highlight bullets short and concise (2 to 4 words each, e.g. <i>"Baby Planning"</i>, <i>"Natural Conception"</i>, <i>"Safe Delivery"</i>) so the course card boxes in the app remain clean, elegant, and readable.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Image URL (Optional)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://... card banner"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Card Bullet #1 *
                </label>
                <input
                  type="text"
                  value={formData.bullet1}
                  onChange={(e) => setFormData({ ...formData, bullet1: e.target.value })}
                  placeholder="e.g. Baby Planning"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Card Bullet #2 *
                </label>
                <input
                  type="text"
                  value={formData.bullet2}
                  onChange={(e) => setFormData({ ...formData, bullet2: e.target.value })}
                  placeholder="e.g. Natural Conception"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Card Bullet #3 (Optional)
                </label>
                <input
                  type="text"
                  value={formData.bullet3}
                  onChange={(e) => setFormData({ ...formData, bullet3: e.target.value })}
                  placeholder="e.g. Great Child"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500 text-xs font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Category & Life Stage */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              >
                <option value="Vedic Garbh Sanskar">Vedic Garbh Sanskar</option>
                <option value="Prenatal Yoga & Meditation">Prenatal Yoga & Meditation</option>
                <option value="Trimester Diet & Nutrition">Trimester Diet & Nutrition</option>
                <option value="Ayurvedic Doctor Guidance">Ayurvedic Doctor Guidance</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Target Stage
              </label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              >
                <option value="pregnant">Pregnant (गर्भवती)</option>
                <option value="planning">Preconception / Planning (गर्भाधान)</option>
                <option value="postnatal">Bal Sanskar / Postnatal (बाल संस्कार)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Duration (Months)
              </label>
              <input
                type="number"
                min={1}
                max={12}
                value={formData.durationMonths}
                onChange={(e) => setFormData({ ...formData, durationMonths: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Calculated Price (₹)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                Original Price (₹)
              </label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>
          </div>

          {/* App Dynamic Screen Experience (Universal Frame Styling) */}
          <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-5">
            <div className="flex items-center space-x-2.5">
              <Sliders className="w-5 h-5 text-saffron-600" />
              <div>
                <h3 className="text-sm font-bold text-slate-900">App Screen Styling & Experience Config</h3>
                <p className="text-xs text-slate-600">
                  Configure how this course renders inside the mobile app course preview and dashboard frame.
                </p>
              </div>
            </div>

            {/* Tagline & Timeline Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tagline Pill (Hindi/Eng)
                </label>
                <input
                  type="text"
                  value={formData.taglinePill}
                  onChange={(e) => setFormData({ ...formData, taglinePill: e.target.value })}
                  placeholder="e.g. मैं से माँ तक की आनंदमयी यात्रा"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Timeline Mode
                </label>
                <select
                  value={formData.timelineMode}
                  onChange={(e) => {
                    const mode = e.target.value;
                    const defaultLabels: Record<string, string> = {
                      pregnancy_months: 'Pregnancy Month',
                      conception_phases: 'Conception Phase',
                      infant_months: 'Infant Age Month',
                      consultations: 'Consultation Session',
                    };
                    setFormData({
                      ...formData,
                      timelineMode: mode,
                      timelineLabel: defaultLabels[mode] || 'Program Month',
                    });
                  }}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                >
                  <option value="pregnancy_months">Pregnancy Months (Month 1-9)</option>
                  <option value="conception_phases">Conception Phases (Pre-Pregnancy)</option>
                  <option value="infant_months">Infant Age Months (0-2 Yrs)</option>
                  <option value="consultations">Consultation Sessions (Astrology / 1-on-1)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Timeline Selector Label
                </label>
                <input
                  type="text"
                  value={formData.timelineLabel}
                  onChange={(e) => setFormData({ ...formData, timelineLabel: e.target.value })}
                  placeholder="e.g. Pregnancy Month / Conception Phase"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                />
              </div>
            </div>

            {/* Mentor Banner Details */}
            <div className="pt-2 border-t border-amber-200/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-800">Featured Class / Mentor Banner</span>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showMentorBanner}
                    onChange={(e) => setFormData({ ...formData, showMentorBanner: e.target.checked })}
                    className="rounded text-saffron-600 focus:ring-saffron-500 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-slate-700">Show Free Class Banner</span>
                </label>
              </div>

              {formData.showMentorBanner && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Mentor Name</label>
                    <input
                      type="text"
                      value={formData.mentorName}
                      onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
                      placeholder="e.g. Prof. Vipin Joshi"
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Free Class Title</label>
                    <input
                      type="text"
                      value={formData.classTitle}
                      onChange={(e) => setFormData({ ...formData, classTitle: e.target.value })}
                      placeholder="e.g. Miraculous Pregnancy"
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Class Subtitle</label>
                    <input
                      type="text"
                      value={formData.mentorSubtitle}
                      onChange={(e) => setFormData({ ...formData, mentorSubtitle: e.target.value })}
                      placeholder="e.g. Garbh Sanskar Class"
                      className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Widget & Tool Toggles */}
            <div className="pt-2 border-t border-amber-200/60">
              <span className="text-xs font-bold text-slate-800 block mb-2">
                Included Support Modules & Widgets (Enabled for this Course)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showAudioLibrary}
                    onChange={(e) => setFormData({ ...formData, showAudioLibrary: e.target.checked })}
                    className="rounded text-saffron-600 focus:ring-saffron-500 w-4 h-4"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">🎵 Audio Library</p>
                    <p className="text-[10px] text-slate-500">432Hz Raagas, Mantras & Samvad</p>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showBrainupedia}
                    onChange={(e) => setFormData({ ...formData, showBrainupedia: e.target.checked })}
                    className="rounded text-saffron-600 focus:ring-saffron-500 w-4 h-4"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">🧠 Brainupedia & Games</p>
                    <p className="text-[10px] text-slate-500">Cognitive quiz & puzzle sessions</p>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showTools}
                    onChange={(e) => setFormData({ ...formData, showTools: e.target.checked })}
                    className="rounded text-saffron-600 focus:ring-saffron-500 w-4 h-4"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">🩺 Interactive Tools</p>
                    <p className="text-[10px] text-slate-500">Kick counter, womb game, water tracker</p>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showLiveSessions}
                    onChange={(e) => setFormData({ ...formData, showLiveSessions: e.target.checked })}
                    className="rounded text-saffron-600 focus:ring-saffron-500 w-4 h-4"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">🔴 Live Sessions</p>
                    <p className="text-[10px] text-slate-500">Live doctor & interactive zoom</p>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-slate-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showThoughtOfDay}
                    onChange={(e) => setFormData({ ...formData, showThoughtOfDay: e.target.checked })}
                    className="rounded text-saffron-600 focus:ring-saffron-500 w-4 h-4"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800">💡 Thought of Day</p>
                    <p className="text-[10px] text-slate-500">Daily inspirational Vedic quote</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Overview */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
              Detailed Overview & Vedic Methodology
            </label>
            <textarea
              rows={4}
              value={formData.overview}
              onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
              placeholder="Explain the month-wise goals, spiritual benefits, and cognitive baby milestones..."
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron-500"
            />
          </div>

          {/* Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <Link
              href="/dashboard/courses"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-saffron-600 to-amber-500 text-white shadow-md shadow-saffron-900/20 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Saving...' : 'Save & Configure Lessons'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
