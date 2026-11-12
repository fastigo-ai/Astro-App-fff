import {
  ActivityTrackingCollection,
  IActivityTrackingRecord,
  IKundliRecord,
  IMedicalProfileRecord,
  KundliCollection,
  MedicalProfilesCollection,
  SubscriptionsCollection,
  UserJourneysCollection,
} from '../../shared/db/dbStore';

export class KrishnaRepository {
  async createInstallmentSubscription(data: any) {
    return SubscriptionsCollection.insert(data);
  }

  async upsertUserJourneyByUserId(userId: string, update: Record<string, any>) {
    return UserJourneysCollection.upsert({ userId }, update);
  }

  async createKundli(data: IKundliRecord) {
    return KundliCollection.insert(data);
  }

  async findKundlisByUserId(userId: string) {
    return KundliCollection.find({ userId });
  }

  async findMedicalProfilesByUserId(userId: string) {
    return MedicalProfilesCollection.find({ userId });
  }

  async upsertMedicalProfile(userId: string, payload: Partial<IMedicalProfileRecord>) {
    return MedicalProfilesCollection.upsert({ userId }, { ...payload, userId });
  }

  async trackActivity(data: IActivityTrackingRecord) {
    return ActivityTrackingCollection.insert(data);
  }
}

export const krishnaRepository = new KrishnaRepository();

