'use client';

import React, { useState } from 'react';
import {
  FileHeart,
  Save,
  CheckCircle,
  AlertTriangle,
  UserCheck,
  Droplet,
  HeartHandshake,
  Calendar,
} from 'lucide-react';
import Header from '@/components/Header';
import { api } from '@/lib/api';

export default function DailyCareNotesPage() {
  const [selectedMonth, setSelectedMonth] = useState(4);
  const [selectedDay, setSelectedDay] = useState(1);
  const [saved, setSaved] = useState(false);

  const [notes, setNotes] = useState({
    dos: '• Sleep in left-lateral (left side) position for optimal uterine blood flow.\n• Drink 2.5 to 3 liters of lukewarm water throughout the day.\n• Chant or listen to soothing Raag Yaman for 15 minutes before sleep.\n• Wear comfortable, breathable loose cotton clothing.',
    donts: '• Do NOT skip meals or stay hungry for more than 3 hours.\n• Avoid sleeping completely flat on your back (supine position).\n• Strictly avoid unpasteurized cheeses, raw papaya, and excessive caffeine.\n• Avoid stressful debates, loud negative news, and violent television.',
    fatherDuties: '• Sit beside your wife at 8:00 PM and read the Garbh Samvad script aloud to baby.\n• Offer a gentle 10-minute warm sesame oil foot massage to relieve swelling.\n• Ensure her water bottle is always replenished beside her bedside.\n• Accompany her on a calm, conversational 20-minute evening walk in fresh air.',
    medicalAdvice: '• Fetal movement (quickening) becomes noticeable in Month 4-5. Log all baby flutters.\n• Normal blood pressure range: 110/70 to 120/80 mmHg.\n• If experiencing persistent severe headaches or sudden ankle swelling, immediately alert doctor.',
    hydrationLiters: 2.8,
  });

  const loadNotes = async (m: number, d: number) => {
    try {
      const res = await api.getCareNotes(m, d);
      if (res.success && res.data) {
        setNotes(res.data);
      }
    } catch {
      // Keep existing default
    }
  };

  const handleMonthChange = (m: number) => {
    setSelectedMonth(m);
    setSaved(false);
    loadNotes(m, selectedDay);
  };

  const handleDayChange = (d: number) => {
    setSelectedDay(d);
    setSaved(false);
    loadNotes(selectedMonth, d);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveCareNotes({
        ...notes,
        month: selectedMonth,
        day: selectedDay,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save care notes');
    }
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Daily Care Notes & Guidelines"
        subtitle="Manage daily Do's & Don'ts, Father's bonding participation, and doctor health guidelines."
        actionButton={
          <button
            onClick={handleSave}
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-md shadow-emerald-900/20 transition"
          >
            <Save className="w-4 h-4 mr-1.5" /> Save Care Notes
          </button>
        }
      />

      <div className="p-8 max-w-5xl mx-auto space-y-6">
        {/* Month & Day Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900">
                Editing Care Note: Month {selectedMonth}, Day {selectedDay}
              </h4>
              <p className="text-xs text-slate-500">
                This note appears on the mother and father’s daily dashboard feed.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <select
              value={selectedMonth}
              onChange={(e) => handleMonthChange(Number(e.target.value))}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((m) => (
                <option key={m} value={m}>
                  Month {m}
                </option>
              ))}
            </select>

            <select
              value={selectedDay}
              onChange={(e) => handleDayChange(Number(e.target.value))}
              className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold"
            >
              {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
                <option key={d} value={d}>
                  Day {d}
                </option>
              ))}
            </select>
          </div>
        </div>

        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">Care notes published successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* Mother's Do's & Don'ts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-emerald-700 font-bold text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Mother's Daily Do's (सकारात्मक नियम)</span>
              </div>
              <textarea
                rows={5}
                value={notes.dos}
                onChange={(e) => setNotes({ ...notes, dos: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed"
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 text-rose-700 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Mother's Daily Don'ts (वर्जित सावधानियां)</span>
              </div>
              <textarea
                rows={5}
                value={notes.donts}
                onChange={(e) => setNotes({ ...notes, donts: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed"
              />
            </div>
          </div>

          {/* Father's Supportive Role (Husband duties) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 text-purple-700 font-bold text-sm">
              <HeartHandshake className="w-4 h-4" />
              <span>Father's Daily Care & Emotional Support Guidelines (पिता का कर्तव्य)</span>
            </div>
            <p className="text-xs text-slate-500">
              Guidance sent to the husband’s app screen to foster active partnership throughout pregnancy.
            </p>
            <textarea
              rows={4}
              value={notes.fatherDuties}
              onChange={(e) => setNotes({ ...notes, fatherDuties: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed"
            />
          </div>

          {/* Doctor Medical Advice & Hydration */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-blue-700 font-bold text-sm">
                <UserCheck className="w-4 h-4" />
                <span>Doctor's Health & Trimester Clinical Observation</span>
              </div>

              <div className="flex items-center space-x-2 text-xs text-slate-600">
                <Droplet className="w-4 h-4 text-blue-500" />
                <span>Hydration Target:</span>
                <input
                  type="number"
                  step="0.1"
                  value={notes.hydrationLiters}
                  onChange={(e) => setNotes({ ...notes, hydrationLiters: Number(e.target.value) })}
                  className="w-16 px-2 py-1 bg-slate-100 border border-slate-300 rounded text-center text-xs font-bold"
                />
                <span>Liters</span>
              </div>
            </div>

            <textarea
              rows={3}
              value={notes.medicalAdvice}
              onChange={(e) => setNotes({ ...notes, medicalAdvice: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs leading-relaxed"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
