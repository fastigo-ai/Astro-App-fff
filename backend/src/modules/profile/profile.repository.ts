import { IUserJourney, UserJourneysCollection } from '../../shared/db/dbStore';
import { BaseRepository } from '../../shared/repositories/baseRepository';

export class ProfileRepository extends BaseRepository<IUserJourney> {
  constructor() {
    super(UserJourneysCollection);
  }

  async updatePreferencesByPhone(phone: string, data: Record<string, any>) {
    if (!phone) return null;
    return this.upsert({ phone }, data as any);
  }
}

export const profileRepository = new ProfileRepository();

