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
    });
    console.log(
      `[KickCounter] Saved session for ${params.phone}: ${params.totalKicks} kicks in ${params.durationSeconds}s`
    );
    return record;
  },

  async getKickSessions(phone: string) {
    const all = await kickSessionRepository.find({ phone });
    return sortNewestFirst(all);
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

