import {
  IProgramSchemeRecord,
  ISubscriptionRecord,
  ProgramSchemesCollection,
  SubscriptionsCollection,
  UserJourneysCollection,
} from '../../shared/db/dbStore';
import { BaseRepository } from '../../shared/repositories/baseRepository';

export class SubscriptionRepository extends BaseRepository<ISubscriptionRecord> {
  constructor() {
    super(SubscriptionsCollection);
  }

  async findActiveByPhone(phone: string) {
    return this.findOne({ phone, status: 'active' });
  }

  async findByPaymentId(paymentId: string) {
    return this.findOne({ paymentId });
  }

  async findJourneyByPhone(phone: string) {
    return UserJourneysCollection.findOne({ phone });
  }

  async upsertJourney(phone: string, update: Record<string, any>) {
    return UserJourneysCollection.upsert({ phone }, update);
  }
}

export class ProgramSchemeRepository extends BaseRepository<IProgramSchemeRecord> {
  constructor() {
    super(ProgramSchemesCollection);
  }
}

export const subscriptionRepository = new SubscriptionRepository();
export const programSchemeRepository = new ProgramSchemeRepository();

