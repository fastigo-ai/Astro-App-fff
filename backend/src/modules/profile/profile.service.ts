import { profileRepository } from './profile.repository';

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
};
