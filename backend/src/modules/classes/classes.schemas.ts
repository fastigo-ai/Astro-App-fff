import { z } from 'zod';

export const createLiveClassSchema = z.object({
  programId: z.string().trim().min(1).default('garbh_sanskar'),
  title: z.string().trim().min(1, 'Title is required'),
  subtitle: z.string().trim().optional(),
  description: z.string().trim().optional(),
  hindiTitle: z.string().trim().optional(),
  instructor: z.string().trim().optional(),
  doctorName: z.string().trim().optional(),
  mentorName: z.string().trim().optional(),
  mentorRole: z.string().trim().optional(),
  credentials: z.string().trim().optional(),
  institution: z.string().trim().optional(),
  dateTime: z.string().trim().optional(),
  scheduledAt: z.string().trim().optional(),
  startTime: z.string().trim().optional(),
  durationMinutes: z.coerce.number().int().positive().default(45),
  joinUrl: z.string().trim().optional(),
  zoomLink: z.string().trim().optional(),
  meetingUrl: z.string().trim().optional(),
  coverImageUrl: z.string().trim().optional(),
  thumbnail: z.string().trim().optional(),
  status: z
    .enum(['upcoming', 'live', 'live_today', 'completed', 'cancelled'])
    .optional()
    .default('upcoming'),
  trimester: z.string().trim().optional(),
  category: z.string().trim().optional(),
  categoryLabel: z.string().trim().optional(),
  overview: z.string().trim().optional(),
  learningPoints: z.array(z.string().trim()).optional(),
  maxCapacity: z.coerce.number().int().positive().optional(),
  maxAttendees: z.coerce.number().int().positive().optional(),
  isFreePreview: z.boolean().optional().default(false),
  notesUrl: z.string().trim().optional(),
});

export const updateLiveClassSchema = createLiveClassSchema.partial().extend({
  recordingUrl: z.string().trim().optional(),
});

export const createRecordedClassSchema = z.object({
  programId: z.string().trim().min(1).default('garbh_sanskar'),
  sourceLiveClassId: z.string().trim().optional(),
  title: z.string().trim().min(1, 'Title is required'),
  hindiTitle: z.string().trim().optional(),
  doctorName: z.string().trim().optional(),
  instructor: z.string().trim().optional(),
  mentorName: z.string().trim().optional(),
  mentorRole: z.string().trim().optional(),
  duration: z.string().trim().optional().default('45 mins'),
  durationMinutes: z.coerce.number().int().positive().optional(),
  durationSeconds: z.coerce.number().int().nonnegative().optional(),
  category: z.string().trim().default('general'),
  categoryLabel: z.string().trim().default('Recorded Masterclass 🎬'),
  trimester: z.string().trim().default('All Trimesters'),
  notesAvailable: z.boolean().optional(),
  notesUrl: z.string().trim().optional(),
  thumbnail: z
    .string()
    .trim()
    .optional()
    .default('https://images.unsplash.com/photo-1544717305-2782549b5136?w=600'),
  thumbnailUrl: z.string().trim().optional(),
  videoUrl: z.string().trim().min(1, 'videoUrl is required'),
  summary: z.string().trim().optional().default(''),
  description: z.string().trim().optional(),
  takeaways: z.array(z.string().trim()).optional().default([]),
  isFreePreview: z.boolean().optional().default(false),
  status: z.enum(['published', 'draft', 'archived']).optional().default('published'),
});

export const updateRecordedClassSchema = createRecordedClassSchema.partial();

export const publishRecordingSchema = z.object({
  videoUrl: z.string().trim().min(1, 'videoUrl is required'),
  duration: z.string().trim().optional(),
  durationMinutes: z.coerce.number().int().positive().optional(),
  durationSeconds: z.coerce.number().int().nonnegative().optional(),
  summary: z.string().trim().optional(),
  description: z.string().trim().optional(),
  takeaways: z.array(z.string().trim()).optional(),
  notesUrl: z.string().trim().optional(),
  thumbnail: z.string().trim().optional(),
  thumbnailUrl: z.string().trim().optional(),
  category: z.string().trim().optional(),
  categoryLabel: z.string().trim().optional(),
  trimester: z.string().trim().optional(),
  isFreePreview: z.boolean().optional(),
});

export const recordedProgressSchema = z.object({
  watchedSeconds: z.coerce.number().nonnegative().default(0),
  durationSeconds: z.coerce.number().nonnegative().default(0),
  completed: z.boolean().optional(),
  phone: z.string().trim().optional(),
  userId: z.string().trim().optional(),
});

export type CreateLiveClassInput = z.infer<typeof createLiveClassSchema>;
export type UpdateLiveClassInput = z.infer<typeof updateLiveClassSchema>;
export type CreateRecordedClassInput = z.infer<typeof createRecordedClassSchema>;
export type UpdateRecordedClassInput = z.infer<typeof updateRecordedClassSchema>;
export type PublishRecordingInput = z.infer<typeof publishRecordingSchema>;
export type RecordedProgressInput = z.infer<typeof recordedProgressSchema>;

