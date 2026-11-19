'use client';

import React, { useState } from 'react';
import {
  CalendarDays,
  Sparkles,
  Music,
  Heart,
  Gamepad2,
  Utensils,
  Moon,
  Plus,
  Save,
  CheckCircle2,
  Play,
  Layers,
} from 'lucide-react';
import Header from '@/components/Header';
import { VEDIC_MONTH_MILESTONES } from '@/lib/constants';
import { api } from '@/lib/api';

interface DailySchedule {
  day: number;
  mantraTitle: string;
  mantraText: string;
  mantraAudioUrl: string;
  samvadTopic: string;
  samvadAudioUrl: string;
  gameType: string;
  gameTitle: string;
  yogaPose: string;
  yogaVideoUrl: string;
  dietTip: string;
  bedtimeRaaga: string;
}

const DEFAULT_DAYS_SCHEDULE: Record<number, DailySchedule> = {
  1: {
    day: 1,
    mantraTitle: 'Pratah Smaran & Gayatri Shloka (ॐ भूर्भुवः स्वः)',
    mantraText: 'ॐ भूर्भुवः स्वः तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि धियो यो नः प्रचोदयात्॥',
    mantraAudioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c89013e896.mp3',
    samvadTopic: 'Welcoming Baby to a Peaceful Home (स्नेह संवाद)',
    samvadAudioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2492161f52.mp3',
    gameType: 'Vedic Memory Match',
    gameTitle: 'Lotus & Sacred Geometry Concentration Challenge',
    yogaPose: 'Marjaryasana (Cat-Cow Pose) for Spine Flexibility',
    yogaVideoUrl: 'https://www.youtube.com/watch?v=sample1',
    dietTip: 'Soaked almonds (5) + saffron lukewarm organic cow milk.',
    bedtimeRaaga: 'Raag Yaman in 432Hz (Pure Flute for Deep Sleep)',
  },
  2: {
    day: 2,
    mantraTitle: 'Santan Gopal Stotra for Divine Radiance',
    mantraText: 'देवकीसुत गोविन्द वासुदेव जगत्पते। देहि मे तनयं कृष्ण त्वामहं शरणं गतः॥',
    mantraAudioUrl: 'https://cdn.pixabay.com/download/audio/2022/05/16/audio_c89013e896.mp3',
    samvadTopic: 'Father’s Touch & Gentle Womb Greeting (पिता का संवाद)',
    samvadAudioUrl: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_2492161f52.mp3',
    gameType: 'Math & Logic Riddle',
    gameTitle: 'Visual Pattern Sequence & Memory Card Boost',
    yogaPose: 'Baddha Konasana (Butterfly Pose) for Pelvic Circulation',
    yogaVideoUrl: 'https://www.youtube.com/watch?v=sample2',
    dietTip: 'Fresh coconut water + handful of soaked walnuts for brain DHA.',
    bedtimeRaaga: 'Raag Bhairav Instrumental (Calming Brainwaves)',
  },
};

export default function DailyActivitiesPage() {
  const [selectedMonth, setSelectedMonth] = useState<number>(4);
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [schedule, setSchedule] = useState<DailySchedule>(DEFAULT_DAYS_SCHEDULE[1]!);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const activeMilestone =
    VEDIC_MONTH_MILESTONES.find((m) => m.month === selectedMonth) || VEDIC_MONTH_MILESTONES[3]!;

  const fetchSchedule = async (m: number, d: number) => {
    try {
      const res = await api.getDailySchedule(m, d);
      if (res.success && res.data) {
        setSchedule(res.data);
      }
    } catch {
      // Fallback to local template
      setSchedule(DEFAULT_DAYS_SCHEDULE[d] || {
        day: d,
        mantraTitle: `Day ${d} Vedic Shloka & Chanting`,
        mantraText: 'ॐ नमो भगवते वासुदेवाय॥',
        mantraAudioUrl: '',
        samvadTopic: `Day ${d} Womb Talk: Gratitude & Love`,
        samvadAudioUrl: '',
        gameType: 'Brain Game',
        gameTitle: `Day ${d} Cognitive Stimulation`,
        yogaPose: 'Tadasana & Gentle Breathwork',
        yogaVideoUrl: '',
        dietTip: 'High-fiber seasonal fruits & iron-rich spinach soup.',
        bedtimeRaaga: 'Raag Bageshri Classical Lullaby',
      });
    }
  };

  const handleDaySelect = (dayNum: number) => {
    setSelectedDay(dayNum);
    setSavedSuccess(false);
    fetchSchedule(selectedMonth, dayNum);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.saveDailySchedule({
        ...schedule,
        month: selectedMonth,
        day: selectedDay,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save daily schedule');
    }
  };

  return (
    <div className="flex-1 pb-16">
      <Header
        title="Monthly & Daily Activities"
        subtitle="Manage 30-day Garbh Sanskar schedules: Shlokas, Samvad, Brain Games, Yoga, and Diet charts."
        actionButton={
          <button
            onClick={handleSave}
            className="inline-flex items-center px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-saffron-600 to-amber-500 hover:from-saffron-500 hover:to-amber-400 text-white shadow-md shadow-saffron-900/20 transition"
          >
            <Save className="w-4 h-4 mr-1.5" /> Save Day {selectedDay} Schedule
          </button>
        }
      />

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Month Selector Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
            Select Gestational Month:
          </p>
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {VEDIC_MONTH_MILESTONES.map((m) => (
              <button
                key={m.month}
                onClick={() => setSelectedMonth(m.month)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedMonth === m.month
                    ? 'bg-saffron-600 text-white shadow-md shadow-saffron-900/20'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                Month {m.month} • {m.sanskritName.split(' ')[0]}
              </button>
            ))}
          </div>

          {/* Active Month Banner */}
          <div className="mt-4 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                Trimester {activeMilestone.trimester} • {activeMilestone.weeksRange}
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-1">{activeMilestone.sanskritName}</h4>
              <p className="text-xs text-amber-900 font-medium">{activeMilestone.hindiTitle}</p>
              <p className="text-xs text-slate-600 mt-1.5">{activeMilestone.fetalDevelopment}</p>
            </div>
            <div className="text-right max-w-xs text-xs text-slate-500">
              <span className="font-semibold text-slate-700 block">Primary Focus:</span>
              <span>{activeMilestone.primaryPractice}</span>
            </div>
          </div>
        </div>

        {/* 30-Day Quick Selector Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <CalendarDays className="w-4 h-4 text-saffron-600" />
              <span>Days of Month {selectedMonth} (1 to 30)</span>
            </h4>
            <span className="text-xs text-slate-400">Click any day to edit its daily activities</span>
          </div>

          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2">
            {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => (
              <button
                key={d}
                onClick={() => handleDaySelect(d)}
                className={`py-2 text-xs font-bold rounded-lg border transition ${
                  selectedDay === d
                    ? 'bg-purple-900 text-white border-purple-900 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Day {d}
              </button>
            ))}
          </div>
        </div>

        {/* Save Confirmation Toast */}
        {savedSuccess && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center space-x-2 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span className="font-semibold">
              Month {selectedMonth}, Day {selectedDay} activities successfully saved and published!
            </span>
          </div>
        )}

        {/* Day's 5 Core Pillars Form */}
        <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pillar 1: Morning Mantra & Shloka */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Music className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">1. Morning Mantra & Shloka</h5>
                <p className="text-xs text-slate-400">Dawn spiritual vibration</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Mantra Title</label>
              <input
                type="text"
                value={schedule.mantraTitle}
                onChange={(e) => setSchedule({ ...schedule, mantraTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Sanskrit Shloka Text</label>
              <textarea
                rows={2}
                value={schedule.mantraText}
                onChange={(e) => setSchedule({ ...schedule, mantraText: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Audio Recording URL (MP3/HLS)</label>
              <input
                type="text"
                value={schedule.mantraAudioUrl}
                onChange={(e) => setSchedule({ ...schedule, mantraAudioUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Pillar 2: Garbh Samvad (Womb Conversation) */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">2. Garbh Samvad (Womb Talk)</h5>
                <p className="text-xs text-slate-400">Mother & Father bonding script</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Samvad Theme / Topic</label>
              <input
                type="text"
                value={schedule.samvadTopic}
                onChange={(e) => setSchedule({ ...schedule, samvadTopic: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Guided Audio URL</label>
              <input
                type="text"
                value={schedule.samvadAudioUrl}
                onChange={(e) => setSchedule({ ...schedule, samvadAudioUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Pillar 3: Brain Stimulation Game */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">3. Brain Stimulation Game</h5>
                <p className="text-xs text-slate-400">Cognitive development challenge</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Game Category</label>
              <select
                value={schedule.gameType}
                onChange={(e) => setSchedule({ ...schedule, gameType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              >
                <option value="Vedic Memory Match">Vedic Memory Match</option>
                <option value="Math & Logic Riddle">Math & Logic Riddle</option>
                <option value="Raaga Sound Quiz">Raaga Sound Quiz</option>
                <option value="Word & Vocabulary Puzzle">Word & Vocabulary Puzzle</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Challenge Title</label>
              <input
                type="text"
                value={schedule.gameTitle}
                onChange={(e) => setSchedule({ ...schedule, gameTitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Pillar 4: Prenatal Yoga & Pranayama */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h5 className="font-bold text-slate-900 text-sm">4. Prenatal Yoga & Breathing</h5>
                <p className="text-xs text-slate-400">Safe trimester movement</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Yoga Asana Name</label>
              <input
                type="text"
                value={schedule.yogaPose}
                onChange={(e) => setSchedule({ ...schedule, yogaPose: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Instructional Video URL</label>
              <input
                type="text"
                value={schedule.yogaVideoUrl}
                onChange={(e) => setSchedule({ ...schedule, yogaVideoUrl: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
              />
            </div>
          </div>

          {/* Pillar 5: Ayurvedic Diet & Bedtime Raaga */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 md:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">5. Ayurvedic Diet & Nutrition</h5>
                    <p className="text-xs text-slate-400">Sattvic recipe and hydration advice</p>
                  </div>
                </div>
                <textarea
                  rows={3}
                  value={schedule.dietTip}
                  onChange={(e) => setSchedule({ ...schedule, dietTip: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
                    <Moon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-sm">6. Bedtime Raaga & Lullaby</h5>
                    <p className="text-xs text-slate-400">432Hz sleep soothing audio</p>
                  </div>
                </div>
                <input
                  type="text"
                  value={schedule.bedtimeRaaga}
                  onChange={(e) => setSchedule({ ...schedule, bedtimeRaaga: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
