import { z } from 'zod';

export const createLessonSchema = z.object({
  moduleTitle: z.string().trim().min(1, 'moduleTitle is required'),
  moduleOrder: z.coerce.number().int().min(1).optional(),
  lessonTitle: z.string().trim().min(1, 'lessonTitle is required'),
  order: z.coerce.number().int().min(1).optional(),
  description: z.string().trim().optional(),
  contentType: z.enum(['video', 'audio', 'pdf', 'activity']).default('video'),
  duration: z.string().trim().min(1).default('15 mins'),
  durationSeconds: z.coerce.number().int().nonnegative().optional(),
  contentUrl: z.string().trim().min(1, 'contentUrl is required'),
  thumbnail: z.string().trim().optional(),
  notesUrl: z.string().trim().optional(),
  trimester: z.string().trim().optional(),
  isFreePreview: z.boolean().optional().default(false),
  status: z.enum(['published', 'draft']).optional().default('published'),
});

export const updateLessonSchema = createLessonSchema.partial();

export const lessonProgressSchema = z.object({
  watchedSeconds: z.coerce.number().nonnegative().default(0),
  durationSeconds: z.coerce.number().nonnegative().default(0),
  completed: z.boolean().optional(),
  phone: z.string().trim().optional(),
  userId: z.string().trim().optional(),
});

export type CreateLessonInput = z.infer<typeof createLessonSchema>;
export type UpdateLessonInput = z.infer<typeof updateLessonSchema>;
export type LessonProgressInput = z.infer<typeof lessonProgressSchema>;

