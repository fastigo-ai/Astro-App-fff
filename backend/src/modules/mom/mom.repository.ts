import {
  IKickSession,
  IMoodLog,
  ISamvadNote,
  KickSessionsCollection,
  MoodLogsCollection,
  SamvadNotesCollection,
} from '../../shared/db/dbStore';
import { BaseRepository } from '../../shared/repositories/baseRepository';

export class KickSessionRepository extends BaseRepository<IKickSession> {
  constructor() {
    super(KickSessionsCollection);
  }
}

export class MoodLogRepository extends BaseRepository<IMoodLog> {
  constructor() {
    super(MoodLogsCollection);
  }
}

export class SamvadNoteRepository extends BaseRepository<ISamvadNote> {
  constructor() {
    super(SamvadNotesCollection);
  }
}

export const kickSessionRepository = new KickSessionRepository();
export const moodLogRepository = new MoodLogRepository();
export const samvadNoteRepository = new SamvadNoteRepository();

