import {
  kickSessionRepository,
  moodLogRepository,
  samvadNoteRepository,
} from './mom.repository';

function sortNewestFirst<T extends { createdAt?: string }>(items: T[]): T[] {
  return [...items].sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );
}

export const momService = {
  async saveKickSession(params: {
    userId: string;
    phone: string;
    babyId?: string;
    totalKicks: number;
    durationSeconds: number;
    targetKicks: number;
    completed: boolean;
    notes?: string;
    kickTimestamps?: string[];
    vigourLevel?: string;
    gameScore?: number;
    streakDays?: number;
    stimulusResponses?: Array<{
      stimulus: string;
      latencySeconds: number;
      zone?: number;
    }>;
  }) {
    const record = await kickSessionRepository.create({
      userId: params.userId,
      phone: params.phone,
      babyId: params.babyId || 'Baby 1',
      totalKicks: Number(params.totalKicks) || 0,
      durationSeconds: Number(params.durationSeconds) || 0,
      targetKicks: Number(params.targetKicks) || 10,
      completed: Boolean(params.completed),
      notes: params.notes || '',
      kickTimestamps: Array.isArray(params.kickTimestamps) ? params.kickTimestamps : [],
      vigourLevel: params.vigourLevel || (Number(params.totalKicks) >= 8 ? 'Champion Gymnast' : Number(params.totalKicks) >= 4 ? 'Playful Stretching' : 'Gentle Flutters'),
      gameScore: Number(params.gameScore) || 0,
      streakDays: Number(params.streakDays) || 1,
      stimulusResponses: Array.isArray(params.stimulusResponses) ? params.stimulusResponses : [],
    });
    console.log(
      `[KickCounter] Saved session for ${params.phone}: ${params.totalKicks} kicks in ${params.durationSeconds}s (Score: ${params.gameScore || 0})`
    );
    return record;
  },

  async getKickSessions(phone: string) {
    const all = await kickSessionRepository.find({ phone });
    return sortNewestFirst(all);
  },

  async getKickStats(phone: string) {
    const all = await kickSessionRepository.find({ phone });
    const sorted = sortNewestFirst(all);
    const totalSessions = sorted.length;
    const completedSessions = sorted.filter(s => s.completed).length;
    const totalKicks = sorted.reduce((sum, s) => sum + (s.totalKicks || 0), 0);
    const avgDuration = totalSessions > 0
      ? Math.round(sorted.reduce((sum, s) => sum + (s.durationSeconds || 0), 0) / totalSessions)
      : 0;

    // 7-day breakdown
    const now = new Date();
    const last7Days: Array<{ date: string; day: string; kicks: number; completed: boolean }> = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];

      const sessionsOnDate = sorted.filter(s => {
        if (!s.createdAt) return false;
        return s.createdAt.startsWith(dateStr);
      });

      const dayKicks = sessionsOnDate.reduce((sum, s) => sum + (s.totalKicks || 0), 0);
      last7Days.push({
        date: dateStr,
        day: dayName,
        kicks: dayKicks,
        completed: dayKicks >= 10,
      });
    }

    const latest = sorted[0] || null;

    return {
      phone,
      totalSessions,
      completedSessions,
      completionRate: totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0,
      totalKicks,
      avgDurationSeconds: avgDuration,
      last7Days,
      latestSession: latest,
      clinicalStatus: latest && latest.totalKicks >= 10 && latest.durationSeconds <= 7200
        ? 'Healthy & Active (Normal Movement Met)'
        : 'Active Monitoring',
    };
  },

  async saveMoodLog(params: {
    userId: string;
    phone: string;
    moodId?: string;
    moodLabel?: string;
    moodEmoji?: string;
    calmingTherapyUsed?: string;
    breathingSeconds?: number;
    note?: string;
  }) {
    const record = await moodLogRepository.create({
      userId: params.userId,
      phone: params.phone,
      moodId: params.moodId || 'calm',
      moodLabel: params.moodLabel || 'Calm & Blessed',
      moodEmoji: params.moodEmoji || '🌸',
      calmingTherapyUsed: params.calmingTherapyUsed,
      breathingSeconds: Number(params.breathingSeconds) || 0,
      note: params.note || '',
    });
    console.log(`[MoodCheckin] Saved mood for ${params.phone}: ${params.moodEmoji} ${params.moodLabel}`);
    return record;
  },

  async getMoodLogs(phone: string) {
    const all = await moodLogRepository.find({ phone });
    return sortNewestFirst(all);
  },

  async saveSamvadNote(params: {
    userId: string;
    phone: string;
    category?: string;
    title?: string;
    promptSnippet?: string;
    momNote?: string;
    hasAudioRecording?: boolean;
    durationSeconds?: number;
  }) {
    const record = await samvadNoteRepository.create({
      userId: params.userId,
      phone: params.phone,
      category: params.category || 'General',
      title: params.title || 'Womb Conversation',
      promptSnippet: params.promptSnippet || '',
      momNote: params.momNote || '',
      hasAudioRecording: Boolean(params.hasAudioRecording),
      durationSeconds: Number(params.durationSeconds) || 0,
    });
    console.log(`[GarbhSamvad] Saved note for ${params.phone}: "${params.title}"`);
    return record;
  },

  async getSamvadNotes(phone: string) {
    const all = await samvadNoteRepository.find({ phone });
    return sortNewestFirst(all);
  },
};

