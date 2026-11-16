import { IUserJourney, UserJourneysCollection } from '../../shared/db/dbStore';
import { BaseRepository } from '../../shared/repositories/baseRepository';

export class ProfileRepository extends BaseRepository<IUserJourney> {
  constructor() {
    super(UserJourneysCollection);
  }

  async findByPhone(phone: string): Promise<IUserJourney | null> {
    const cleaned = phone.replace(/[^0-9]/g, '');
    const users = await this.find();
    return (
      users.find((u) => {
        if (!u.phone) return false;
        const uCleaned = u.phone.replace(/[^0-9]/g, '');
        return uCleaned === cleaned || uCleaned.endsWith(cleaned) || cleaned.endsWith(uCleaned);
      }) || null
    );
  }

  async updatePreferencesByPhone(phone: string, data: Record<string, any>) {
    if (!phone) return null;
    const existing = await this.findByPhone(phone);
    const targetPhone = existing?.phone || phone;
    return this.upsert({ phone: targetPhone }, data as any);
  }
}

export const profileRepository = new ProfileRepository();
