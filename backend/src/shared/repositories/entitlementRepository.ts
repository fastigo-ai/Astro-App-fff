import {
  ISubscriptionRecord,
  IUserJourney,
  SubscriptionsCollection,
  UserJourneysCollection,
} from '../db/dbStore';

export class EntitlementRepository {
  findActiveSubscriptions(phone?: string, userId?: string): ISubscriptionRecord[] {
    const now = Date.now();
    return SubscriptionsCollection.read().filter((sub) => {
      if (sub.status !== 'active') return false;
      if (sub.expiresAt && new Date(sub.expiresAt).getTime() < now) return false;
      if (phone && sub.phone === phone) return true;
      if (userId && sub.userId === userId) return true;
      return false;
    });
  }

  findUserJourney(phone?: string, userId?: string): IUserJourney | null {
    if (!phone && !userId) return null;
    return (
      UserJourneysCollection.read().find(
        (j) => (phone && j.phone === phone) || (userId && j.userId === userId)
      ) || null
    );
  }
}

export const entitlementRepository = new EntitlementRepository();

