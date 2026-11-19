'use client';

import React, { useEffect, useState } from 'react';
import {
  Video,
  Plus,
  Calendar,
  Clock,
  User,
  ExternalLink,
  UploadCloud,
  Trash2,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import Header from '@/components/Header';
import { api } from '@/lib/api';

export default function LiveZoomPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [publishModalClass, setPublishModalClass] = useState<any | null>(null);
  const [recordingUrl, setRecordingUrl] = useState('');

  // New Class Form State
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    mentorName: 'Dr. Radhika Sen',
    mentorRole: 'Senior Ayurvedic Gynecologist',
    startTime: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
    durationMinutes: 60,
    meetingUrl: 'https://zoom.us/j/9366128220?pwd=AstroBabyVedic',
    category: 'Gynaecology Q&A',
    maxAttendees: 200,
  });

  const loadClasses = async () => {
    try {
      setLoading(true);
      const res = await api.listClasses();
      if (res.success && res.data) {
        setClasses(res.data);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch live classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createClass({
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
      });
      setShowCreateModal(false);
      loadClasses();
    } catch (err: any) {
      alert(err.message || 'Failed to schedule Zoom meeting');
    }
  };

  const handlePublishRecording = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishModalClass || !recordingUrl.trim()) return;

    try {
      await api.publishRecording(publishModalClass.id, {
        videoUrl: recordingUrl.trim(),
        durationMinutes: publishModalClass.durationMinutes || 60,
      });
      setPublishModalClass(null);
      setRecordingUrl('');
      loadClasses();
    } catch (err: any) {
      alert(err.message || 'Failed to publish recording');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this live Zoom session?')) return;
    try {
      await api.deleteClass(id);
      loadClasses();
    } catch (err: any) {
      alert(err.message || 'Failed to delete class');
    }
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Live Zoom Meetings & Webinars"
        subtitle="Schedule interactive doctor Q&A calls, yoga sessions, and publish recorded masterclasses."
        actionButton={
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-purple-900/20 transition"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Schedule New Zoom Session
          </button>
        }
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {/* Classes Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <h4 className="font-bold text-slate-800 text-sm">Scheduled & Completed Live Sessions</h4>
            <span className="text-xs text-slate-500">{classes.length} Total Sessions</span>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-400 text-sm">Loading Zoom schedules...</div>
          ) : classes.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No live Zoom sessions found. Click "Schedule New Zoom Session" to create one.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {classes.map((cls) => {
                const isCompleted = cls.status === 'completed';
                return (
                  <div key={cls.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800">
                          {cls.category || 'Live Webinar'}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                            isCompleted ? 'bg-slate-200 text-slate-700' : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {cls.status?.toUpperCase() || 'UPCOMING'}
                        </span>
                      </div>

                      <h5 className="font-bold text-base text-slate-900">{cls.title}</h5>
                      <p className="text-xs text-slate-500 flex items-center space-x-4">
                        <span className="flex items-center">
                          <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {cls.mentorName} ({cls.mentorRole})
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {new Date(cls.startTime).toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {cls.durationMinutes} mins
                        </span>
                      </p>
                    </div>

                    <div className="flex items-center space-x-3">
                      {cls.meetingUrl && !isCompleted && (
                        <a
                          href={cls.meetingUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200 flex items-center"
                        >
                          <ExternalLink className="w-3.5 h-3.5 mr-1" /> Zoom Link
                        </a>
                      )}

                      {!isCompleted && (
                        <button
                          onClick={() => setPublishModalClass(cls)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 flex items-center"
                        >
                          <UploadCloud className="w-3.5 h-3.5 mr-1" /> Publish Recording
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(cls.id)}
                        className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Create Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Schedule Live Zoom Class</h3>

              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Session Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Weekly Live Q&A with Senior Gynecologist"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Doctor / Guru *</label>
                    <input
                      type="text"
                      required
                      value={formData.mentorName}
                      onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    >
                      <option value="Gynaecology Q&A">Gynaecology Q&A</option>
                      <option value="Pregnancy Yoga">Pregnancy Yoga</option>
                      <option value="Vedic Chanting">Vedic Chanting</option>
                      <option value="Ayurvedic Diet">Ayurvedic Diet</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Duration (Mins)</label>
                    <input
                      type="number"
                      value={formData.durationMinutes}
                      onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Zoom Meeting Join URL *</label>
                  <input
                    type="url"
                    required
                    value={formData.meetingUrl}
                    onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                  >
                    Schedule Session
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Publish Recording Modal */}
        {publishModalClass && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Publish Class Recording</h3>
              <p className="text-xs text-slate-500">
                Attach the recorded video URL for "{publishModalClass.title}". This will archive the live session and make it accessible to enrolled mothers.
              </p>

              <form onSubmit={handlePublishRecording} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Recorded Video Stream URL (MP4 / YouTube / Cloudinary) *
                  </label>
                  <input
                    type="url"
                    required
                    value={recordingUrl}
                    onChange={(e) => setRecordingUrl(e.target.value)}
                    placeholder="https://res.cloudinary.com/... or https://youtube.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setPublishModalClass(null)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                  >
                    Confirm & Publish
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
