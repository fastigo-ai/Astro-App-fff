import { Request, Response, NextFunction } from 'express';
import { 
  KickSessionsCollection, 
  MoodLogsCollection, 
  SamvadNotesCollection 
} from '../services/dbStore';

export const momInteractionsController = {
  // --- KICK COUNTER ---
  saveKickSession: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || req.body.phone || '9366128220';
      const userId = user?.id || 'usr_123';
      const { totalKicks, durationSeconds, targetKicks, completed, notes, kickTimestamps } = req.body;

      const record = await KickSessionsCollection.insert({
        userId,
        phone,
        totalKicks: Number(totalKicks) || 0,
        durationSeconds: Number(durationSeconds) || 0,
        targetKicks: Number(targetKicks) || 10,
        completed: Boolean(completed),
        notes: notes || '',
        kickTimestamps: Array.isArray(kickTimestamps) ? kickTimestamps : []
      });

      console.log(`[KickCounter] Saved session for ${phone}: ${totalKicks} kicks in ${durationSeconds}s`);

      return res.status(201).json({
        success: true,
        message: 'Kick session saved successfully',
        data: record
      });
    } catch (error) {
      next(error);
    }
  },

  getKickSessions: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || (req.query.phone as string) || '9366128220';

      const all = await KickSessionsCollection.find({ phone });
      // Sort newest first
      const sorted = all.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

      return res.status(200).json({
        success: true,
        data: sorted
      });
    } catch (error) {
      next(error);
    }
  },

  // --- MOOD CHECK-IN & CALMING ---
  saveMoodLog: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || req.body.phone || '9366128220';
      const userId = user?.id || 'usr_123';
      const { moodId, moodLabel, moodEmoji, calmingTherapyUsed, breathingSeconds, note } = req.body;

      const record = await MoodLogsCollection.insert({
        userId,
        phone,
        moodId: moodId || 'calm',
        moodLabel: moodLabel || 'Calm & Blessed',
        moodEmoji: moodEmoji || '🌸',
        calmingTherapyUsed,
        breathingSeconds: Number(breathingSeconds) || 0,
        note: note || ''
      });

      console.log(`[MoodCheckin] Saved mood for ${phone}: ${moodEmoji} ${moodLabel}`);

      return res.status(201).json({
        success: true,
        message: 'Mood check-in saved successfully',
        data: record
      });
    } catch (error) {
      next(error);
    }
  },

  getMoodLogs: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || (req.query.phone as string) || '9366128220';

      const all = await MoodLogsCollection.find({ phone });
      const sorted = all.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

      return res.status(200).json({
        success: true,
        data: sorted
      });
    } catch (error) {
      next(error);
    }
  },

  // --- GARBH SAMVAD NOTES ---
  saveSamvadNote: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || req.body.phone || '9366128220';
      const userId = user?.id || 'usr_123';
      const { category, title, promptSnippet, momNote, hasAudioRecording, durationSeconds } = req.body;

      const record = await SamvadNotesCollection.insert({
        userId,
        phone,
        category: category || 'General',
        title: title || 'Womb Conversation',
        promptSnippet: promptSnippet || '',
        momNote: momNote || '',
        hasAudioRecording: Boolean(hasAudioRecording),
        durationSeconds: Number(durationSeconds) || 0
      });

      console.log(`[GarbhSamvad] Saved note for ${phone}: "${title}"`);

      return res.status(201).json({
        success: true,
        message: 'Garbh Samvad note saved successfully',
        data: record
      });
    } catch (error) {
      next(error);
    }
  },

  getSamvadNotes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const phone = user?.phone || (req.query.phone as string) || '9366128220';

      const all = await SamvadNotesCollection.find({ phone });
      const sorted = all.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

      return res.status(200).json({
        success: true,
        data: sorted
      });
    } catch (error) {
      next(error);
    }
  }
};
