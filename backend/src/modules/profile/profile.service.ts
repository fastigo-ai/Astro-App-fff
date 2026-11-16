import { profileRepository } from './profile.repository';
import {
  IAvatarHistoryItem,
  SubscriptionsCollection,
  KickSessionsCollection,
  MoodLogsCollection,
  SamvadNotesCollection,
} from '../../shared/db/dbStore';

export const profileService = {
  async getProfile(phone: string | undefined) {
    if (!phone) return null;
    return profileRepository.findByPhone(phone);
  },

  async getLanguage(phone: string | undefined): Promise<string> {
    if (!phone) return 'en';
    const user = await profileRepository.findByPhone(phone);
    return user?.language || 'en';
  },

  async updateLanguage(phone: string | undefined, language: string) {
    console.log(`[Backend] Updated language for user ${phone} to: ${language}`);
    if (phone) {
      await profileRepository.updatePreferencesByPhone(phone, { language });
    }
    return { language };
  },

  async saveDetails(phone: string | undefined, details: { name: string; dob?: string; city?: string; state?: string }) {
    console.log(`[Backend] Saved Profile for ${phone}: Name=${details.name}, DOB=${details.dob}`);
    if (phone) {
      await profileRepository.updatePreferencesByPhone(phone, details);
    }
    return details;
  },

  async updateAvatar(
    phone: string | undefined,
    avatarData: { url: string; publicId?: string },
    metadata: { ip?: string; userAgent?: string } = {}
  ) {
    if (!phone) throw new Error('Phone number is required');

    const user = await profileRepository.findByPhone(phone);
    if (!user) throw new Error('User profile not found');

    // Count increments on every profile picture change for legal / audit compliance
    const previousCount = user.avatarUpdateCount || (user.avatar ? 1 : 0);
    const newCount = previousCount + 1;
    const nowIso = new Date().toISOString();

    const historyItem: IAvatarHistoryItem = {
      url: avatarData.url,
      publicId: avatarData.publicId,
      count: newCount,
      updatedAt: nowIso,
      ip: metadata.ip,
      userAgent: metadata.userAgent,
    };

    const currentHistory = user.avatarHistory || [];

    const updated = await profileRepository.updatePreferencesByPhone(phone, {
      avatar: avatarData.url,
      avatarPublicId: avatarData.publicId,
      avatarUpdateCount: newCount,
      avatarUpdatedAt: nowIso,
      avatarHistory: [...currentHistory, historyItem],
    });

    console.log(
      `[Compliance: Audit Log] User ${phone} updated avatar. Total Update Count: ${newCount} at ${nowIso} (IP: ${metadata.ip || 'unknown'})`
    );

    return {
      avatar: avatarData.url,
      avatarPublicId: avatarData.publicId,
      avatarUpdateCount: newCount,
      avatarUpdatedAt: nowIso,
      historyCount: (updated?.avatarHistory || []).length,
    };
  },

  /**
   * Account Deletion Endpoint (Compliant Soft Delete: is_deleted = true)
   * Deactivates the account, marks subscriptions cancelled, flags all user data as soft-deleted,
   * and preserves audit trail for legal and store retention regulations.
   */
  async deleteAccount(phone: string | undefined, reason?: string) {
    if (!phone) throw new Error('Phone number is required');

    const user = await profileRepository.findByPhone(phone);
    if (!user) throw new Error('User profile not found');

    const nowIso = new Date().toISOString();
    const finalReason = reason?.trim() || 'User requested account deletion';

    // 1. Soft-delete user journey record
    await profileRepository.updatePreferencesByPhone(phone, {
      is_deleted: true,
      deleted_at: nowIso,
      deletion_reason: finalReason,
      subscription_status: 'none',
    });

    // 2. Soft-delete / cancel user active subscriptions
    const subCleaned = phone.replace(/[^0-9]/g, '');
    const subscriptions = SubscriptionsCollection.read();
    let subModified = false;
    for (const sub of subscriptions) {
      const matchPhone = sub.phone && sub.phone.replace(/[^0-9]/g, '') === subCleaned;
      const matchUserId = user.userId && sub.userId === user.userId;
      if (matchPhone || matchUserId) {
        sub.is_deleted = true;
        sub.deleted_at = nowIso;
        sub.deletion_reason = `Account deletion: ${finalReason}`;
        sub.status = 'cancelled';
        sub.updatedAt = nowIso;
        subModified = true;
      }
    }
    if (subModified) {
      SubscriptionsCollection.write(subscriptions);
    }

    // 3. Soft-delete user kick sessions
    const kickSessions = KickSessionsCollection.read();
    let kickModified = false;
    for (const kick of kickSessions as any[]) {
      const matchPhone = kick.phone && kick.phone.replace(/[^0-9]/g, '') === subCleaned;
      const matchUserId = user.userId && kick.userId === user.userId;
      if (matchPhone || matchUserId) {
        kick.is_deleted = true;
        kick.deleted_at = nowIso;
        kick.updatedAt = nowIso;
        kickModified = true;
      }
    }
    if (kickModified) {
      KickSessionsCollection.write(kickSessions);
    }

    // 4. Soft-delete user mood logs
    const moodLogs = MoodLogsCollection.read();
    let moodModified = false;
    for (const mood of moodLogs as any[]) {
      const matchPhone = mood.phone && mood.phone.replace(/[^0-9]/g, '') === subCleaned;
      const matchUserId = user.userId && mood.userId === user.userId;
      if (matchPhone || matchUserId) {
        mood.is_deleted = true;
        mood.deleted_at = nowIso;
        mood.updatedAt = nowIso;
        moodModified = true;
      }
    }
    if (moodModified) {
      MoodLogsCollection.write(moodLogs);
    }

    // 5. Soft-delete user samvad notes
    const samvadNotes = SamvadNotesCollection.read();
    let samvadModified = false;
    for (const note of samvadNotes as any[]) {
      const matchPhone = note.phone && note.phone.replace(/[^0-9]/g, '') === subCleaned;
      const matchUserId = user.userId && note.userId === user.userId;
      if (matchPhone || matchUserId) {
        note.is_deleted = true;
        note.deleted_at = nowIso;
        note.updatedAt = nowIso;
        samvadModified = true;
      }
    }
    if (samvadModified) {
      SamvadNotesCollection.write(samvadNotes);
    }

    console.log(
      `[Compliance: Soft Delete] Account deactivated for user ${phone} at ${nowIso}. Reason: "${finalReason}". is_deleted set to true.`
    );

    return {
      success: true,
      is_deleted: true,
      deleted_at: nowIso,
      deletion_reason: finalReason,
      message: 'Account soft-deleted successfully in compliance with store policies and data retention laws.',
    };
  },
};
