import { IUserJourney, UserJourneysCollection } from '../../shared/db/dbStore';
import { BaseRepository } from '../../shared/repositories/baseRepository';

export class AuthRepository extends BaseRepository<IUserJourney> {
  constructor() {
    super(UserJourneysCollection);
  }

  async upsertUserJourney(phone: string, data: Partial<IUserJourney>): Promise<IUserJourney> {
    return this.upsert({ phone }, data);
  }
}

export const authRepository = new AuthRepository();

