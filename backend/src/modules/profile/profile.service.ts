import { profileRepository } from './profile.repository';
import { IAvatarHistoryItem } from '../../shared/db/dbStore';

export const profileService = {
  async getProfile(phone: string | undefined) {
    if (!phone) return null;
    return profileRepository.findByPhone(phone);
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
};
