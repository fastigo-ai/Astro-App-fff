'use client';

import React, { useEffect, useState } from 'react';
import {
  PlayCircle,
  Plus,
  Trash2,
  ExternalLink,
  Clock,
  User,
  Sparkles,
} from 'lucide-react';
import Header from '@/components/Header';
import { api } from '@/lib/api';

export default function RecordedMasterclassesPage() {
  const [recordedList, setRecordedList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    durationMinutes: 45,
    mentorName: 'Dr. Radhika Sen',
    mentorRole: 'Senior Ayurvedic Gynaecologist',
    category: 'Garbh Sanskar',
    thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600',
  });

  const loadRecorded = async () => {
    try {
      setLoading(true);
      const res = await api.listRecorded();
      if (res.success && res.data) {
        setRecordedList(res.data);
      }
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecorded();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createRecorded(formData);
      setShowUploadModal(false);
      loadRecorded();
    } catch (err: any) {
      alert(err.message || 'Failed to upload video lesson');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recorded class?')) return;
    try {
      await api.deleteRecorded(id);
      loadRecorded();
    } catch (err: any) {
      alert(err.message || 'Failed to delete class');
    }
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Recorded Masterclasses & Video LMS"
        subtitle="Upload daily course video lessons, doctor explanations, and audio raagas."
        actionButton={
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center px-4 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-saffron-600 to-amber-500 hover:from-saffron-500 hover:to-amber-400 text-white shadow-md shadow-saffron-900/20 transition"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Upload Video Lesson
          </button>
        }
      />

      <div className="p-8 max-w-7xl mx-auto space-y-6">
        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">Loading video archive...</div>
        ) : recordedList.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <PlayCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700">No recorded masterclasses</h4>
            <p className="text-xs text-slate-400 mt-1">Upload daily video lessons or publish live Zoom recordings.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recordedList.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="h-44 bg-slate-900 relative overflow-hidden group">
                    <img
                      src={item.thumbnailUrl || 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600'}
                      alt={item.title}
                      className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-saffron-600/90 text-white flex items-center justify-center shadow-lg">
                        <PlayCircle className="w-6 h-6" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/70 text-white text-[11px] font-mono">
                      {item.durationMinutes}m
                    </div>
                  </div>

                  <div className="p-5">
                    <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800">
                      {item.category || 'Vedic Lesson'}
                    </span>
                    <h5 className="font-bold text-base text-slate-900 mt-2 leading-snug">{item.title}</h5>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{item.description}</p>

                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center">
                        <User className="w-3.5 h-3.5 mr-1" /> {item.mentorName}
                      </span>
                      <span className="font-medium text-slate-700">Views: {item.viewsCount || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={item.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-xs font-bold text-saffron-700 hover:text-saffron-800"
                  >
                    <span>Stream Video</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </a>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Video Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
              <h3 className="text-lg font-bold text-slate-900">Upload Course Video Lesson</h3>

              <form onSubmit={handleUpload} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Lesson Title *</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Month 4 Day 3: Garbh Samvad & Sound Frequencies"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Mentor / Doctor</label>
                    <input
                      type="text"
                      value={formData.mentorName}
                      onChange={(e) => setFormData({ ...formData, mentorName: e.target.value })}
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
                  <label className="block text-xs font-bold text-slate-700 mb-1">Direct Video URL (MP4 / YouTube / Cloudinary) *</label>
                  <input
                    type="url"
                    required
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://res.cloudinary.com/... or https://youtube.com/..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Description & Study Notes</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief summary of key concepts, benefits, and practices covered in this lesson..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  />
                </div>

                <div className="pt-3 border-t border-slate-200 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-saffron-600 to-amber-500 text-white shadow-sm"
                  >
                    Save & Publish
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
