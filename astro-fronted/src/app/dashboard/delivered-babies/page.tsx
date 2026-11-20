'use client';

import React, { useEffect, useState, useRef } from 'react';
import {
  Baby,
  Plus,
  Trash2,
  Sparkles,
  Heart,
  MapPin,
  Calendar,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Image as ImageIcon,
  X,
} from 'lucide-react';
import Header from '@/components/Header';
import { api } from '@/lib/api';

export default function DeliveredBabiesPage() {
  const [babies, setBabies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    babyName: '',
    parentsName: '',
    city: '',
    deliveryDate: '',
    deliveryType: 'Normal Delivery',
    weight: '3.2 kg',
    gender: 'boy',
    testimonial: '',
    imageUrl: '',
  });

  const loadBabies = async () => {
    try {
      setLoading(true);
      const res = await api.getDeliveredBabies();
      if (res.success && res.data) {
        setBabies(res.data);
      }
    } catch (err: any) {
      console.error('Failed to load delivered babies:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBabies();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setPreviewUrl(url);
  };

  const resetForm = () => {
    setFormData({
      babyName: '',
      parentsName: '',
      city: '',
      deliveryDate: '',
      deliveryType: 'Normal Delivery',
      weight: '3.2 kg',
      gender: 'boy',
      testimonial: '',
      imageUrl: '',
    });
    setSelectedFile(null);
    setPreviewUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.babyName.trim() || !formData.parentsName.trim() || !formData.city.trim()) {
      alert('Please fill in Baby Name, Parents Name, and City.');
      return;
    }

    if (uploadMode === 'file' && !selectedFile) {
      alert('Please select an image file to upload.');
      return;
    }

    if (uploadMode === 'url' && !formData.imageUrl.trim()) {
      alert('Please provide a valid image URL.');
      return;
    }

    try {
      setSubmitting(true);

      if (uploadMode === 'file' && selectedFile) {
        const payload = new FormData();
        payload.append('photo', selectedFile);
        payload.append('babyName', formData.babyName);
        payload.append('parentsName', formData.parentsName);
        payload.append('city', formData.city);
        payload.append('deliveryDate', formData.deliveryDate || `Delivered ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`);
        payload.append('deliveryType', formData.deliveryType);
        payload.append('weight', formData.weight);
        payload.append('gender', formData.gender);
        payload.append('testimonial', formData.testimonial);

        await api.createDeliveredBaby(payload);
      } else {
        await api.createDeliveredBaby(formData);
      }

      setShowModal(false);
      resetForm();
      loadBabies();
    } catch (err: any) {
      alert(err.message || 'Failed to add baby showcase.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the delivered babies showcase?`)) {
      return;
    }
    try {
      await api.deleteDeliveredBaby(id);
      loadBabies();
    } catch (err: any) {
      alert(err.message || 'Failed to delete baby showcase.');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-slate-950">
      <Header
        title="Delivered Astro Babies"
        subtitle="Manage newborn baby showcase photos and family blessings displayed on the app welcome screen."
      />

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* Top Header & Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
          <div>
            <div className="flex items-center space-x-2 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Baby className="w-4 h-4 text-amber-400" />
              <span>Mobile App Social Proof Showcase</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Delivered Astro Babies</h1>
            <p className="text-slate-400 text-sm mt-1">
              Add and manage newborn baby photos and family blessings auto-scrolling upward on the mobile onboarding screen.
            </p>
          </div>

          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-saffron-600 hover:from-amber-600 hover:to-saffron-700 text-white font-medium shadow-lg shadow-amber-900/30 transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Add Delivered Baby</span>
          </button>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total Showcases Active</p>
              <p className="text-lg font-bold text-white">{babies.length}</p>
            </div>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Families Blessed</p>
              <p className="text-lg font-bold text-white">1,50,000+</p>
            </div>
          </div>

          <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/80 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Display Animation</p>
              <p className="text-lg font-bold text-white">Continuous Auto-Scroll</p>
            </div>
          </div>
        </div>

        {/* Grid of Delivered Babies */}
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mx-auto mb-3" />
            Loading delivered babies showcase...
          </div>
        ) : babies.length === 0 ? (
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
            <Baby className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-semibold text-slate-200">No baby stories added yet</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">
              Add your first delivered baby showcase to display healthy baby stories on the app onboarding screen.
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="mt-2 inline-flex items-center space-x-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Add First Baby</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {babies.map((baby) => (
              <div
                key={baby.id}
                className="bg-slate-900/60 rounded-2xl border border-slate-800/80 overflow-hidden flex flex-col hover:border-slate-700 transition-all shadow-lg"
              >
                {/* Photo Header */}
                <div className="relative h-56 w-full bg-slate-950">
                  <img
                    src={baby.imageUrl}
                    alt={baby.babyName}
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1544126592-807ade215a0c?w=600';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-black/30" />

                  {/* Gender & Delivery Badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/90 text-white backdrop-blur-md">
                      {baby.deliveryType || 'Normal Delivery'}
                    </span>
                    {baby.weight && (
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-black/60 text-amber-300 backdrop-blur-md">
                        {baby.weight}
                      </span>
                    )}
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(baby.id, baby.babyName)}
                    className="absolute top-3 right-3 p-2 bg-rose-600/80 hover:bg-rose-600 text-white rounded-full backdrop-blur-md transition-all cursor-pointer"
                    title="Remove from showcase"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  {/* Baby Name Banner Overlay */}
                  <div className="absolute bottom-3 left-3 right-3">
                    <h3 className="text-xl font-bold text-white drop-shadow-md">{baby.babyName}</h3>
                    <p className="text-xs text-amber-300 font-medium">{baby.parentsName}</p>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-slate-400 gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{baby.city}</span>
                    </div>

                    {baby.deliveryDate && (
                      <div className="flex items-center text-xs text-slate-400 gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{baby.deliveryDate}</span>
                      </div>
                    )}

                    {baby.testimonial && (
                      <p className="text-xs text-slate-300 italic bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60 line-clamp-3">
                        "{baby.testimonial}"
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-400 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Live in App Ticker
                    </span>
                    <span>{new Date(baby.createdAt || Date.now()).toLocaleDateString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upload Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl my-8">
              {/* Modal Header */}
              <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Baby className="w-4 h-4" />
                  </div>
                  <h2 className="text-lg font-bold text-white">Add Delivered Baby Story</h2>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                {/* Photo Upload Mode Switcher */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                    Baby / Family Photo *
                  </label>
                  <div className="flex gap-2 mb-3">
                    <button
                      type="button"
                      onClick={() => setUploadMode('file')}
                      className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 border transition-all ${
                        uploadMode === 'file'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setUploadMode('url')}
                      className={`flex-1 py-2 px-3 text-xs font-semibold rounded-lg flex items-center justify-center gap-2 border transition-all ${
                        uploadMode === 'url'
                          ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                          : 'bg-slate-800/50 border-slate-700 text-slate-400'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      Direct Image URL
                    </button>
                  </div>

                  {uploadMode === 'file' ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-slate-700 hover:border-amber-500/80 rounded-xl p-5 text-center cursor-pointer bg-slate-950/40 transition-all"
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/jpeg,image/png,image/webp,image/jpg"
                        className="hidden"
                      />
                      <ImageIcon className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                      <p className="text-sm font-medium text-slate-300">
                        {selectedFile ? selectedFile.name : 'Click to upload baby photo'}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG, WEBP up to 10MB</p>
                    </div>
                  ) : (
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/... or hosted image URL"
                      value={formData.imageUrl}
                      onChange={(e) => handleUrlChange(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  )}

                  {/* Thumbnail Preview */}
                  {previewUrl && (
                    <div className="mt-3 relative h-36 w-full rounded-xl overflow-hidden border border-slate-700 bg-black">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedFile(null);
                          setPreviewUrl('');
                          setFormData((p) => ({ ...p, imageUrl: '' }));
                          if (fileInputRef.current) fileInputRef.current.value = '';
                        }}
                        className="absolute top-2 right-2 p-1 bg-black/70 hover:bg-black text-white rounded-full"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Baby Name & Parents */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Baby Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Baby Aarav"
                      value={formData.babyName}
                      onChange={(e) => setFormData({ ...formData, babyName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Parents Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pooja & Rahul Sharma"
                      value={formData.parentsName}
                      onChange={(e) => setFormData({ ...formData, parentsName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* City & Delivery Tag */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      City, State *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Pune, Maharashtra"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Delivery Date / Tag
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Delivered 14 Oct 2026"
                      value={formData.deliveryDate}
                      onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {/* Delivery Type, Weight & Gender */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Delivery Type
                    </label>
                    <select
                      value={formData.deliveryType}
                      onChange={(e) => setFormData({ ...formData, deliveryType: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="Normal Delivery">Normal Delivery</option>
                      <option value="Cesarean">Cesarean</option>
                      <option value="Gentle Water Birth">Gentle Water Birth</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Weight
                    </label>
                    <input
                      type="text"
                      placeholder="3.2 kg"
                      value={formData.weight}
                      onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                    >
                      <option value="boy">Baby Boy</option>
                      <option value="girl">Baby Girl</option>
                      <option value="twins">Twins</option>
                    </select>
                  </div>
                </div>

                {/* Testimonial / Story */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Parents Blessing / Testimonial
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief feedback from parents about their experience with AstroBaby Garbh Sanskar..."
                    value={formData.testimonial}
                    onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Submit Actions */}
                <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-saffron-600 hover:from-amber-600 hover:to-saffron-700 text-white rounded-xl text-sm font-semibold shadow-lg shadow-amber-900/30 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                  >
                    {submitting ? 'Publishing...' : 'Publish to App Showcase'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
