import {
  BroadcastNotificationsCollection,
  CouponsCollection,
  CourseLessonsCollection,
  IBroadcastNotification,
  ICoupon,
  IKitDispatch,
  KickSessionsCollection,
  KitDispatchesCollection,
  LiveClassesCollection,
  LiveClassRegistrationsCollection,
  MoodLogsCollection,
  PaymentsCollection,
  ProgramSchemesCollection,
  RecordedClassesCollection,
  SubscriptionsCollection,
  SupportTicketsCollection,
  UserJourneysCollection,
} from '../../shared/db/dbStore';

export class AdminRepository {
  getAllUsers() {
    return UserJourneysCollection.read();
  }

  getAllSubscriptions() {
    return SubscriptionsCollection.read();
  }

  getAllPayments() {
    return PaymentsCollection.read();
  }

  getAllPrograms() {
    return ProgramSchemesCollection.read();
  }

  getAllKicks() {
    return KickSessionsCollection.read();
  }

  getAllMoods() {
    return MoodLogsCollection.read();
  }

  getAllCoupons() {
    return CouponsCollection.read();
  }

  async createCoupon(coupon: ICoupon) {
    return CouponsCollection.insert(coupon);
  }

  async deleteCoupon(id: string) {
    return CouponsCollection.delete(id);
  }

  getAllClasses() {
    return LiveClassesCollection.read();
  }

  getAllRecordedClasses() {
    return RecordedClassesCollection.read();
  }

  getAllCourseLessons() {
    return CourseLessonsCollection.read();
  }

  getAllClassRegistrations() {
    return LiveClassRegistrationsCollection.read();
  }

  getAllDispatches() {
    return KitDispatchesCollection.read();
  }

  async createDispatch(dispatch: IKitDispatch) {
    return KitDispatchesCollection.insert(dispatch);
  }

  async updateDispatch(id: string, update: Partial<IKitDispatch>) {
    return KitDispatchesCollection.update(id, update);
  }

  getAllBroadcasts() {
    return BroadcastNotificationsCollection.read();
  }

  async createBroadcast(broadcast: IBroadcastNotification) {
    return BroadcastNotificationsCollection.insert(broadcast);
  }

  getAllSupportTickets() {
    return SupportTicketsCollection.read();
  }

  async insertSubscription(sub: any) {
    return SubscriptionsCollection.insert(sub);
  }

  replaceAllSubscriptions(subs: any[]) {
    SubscriptionsCollection.write(subs);
  }

  async upsertUserJourney(phone: string, update: Record<string, any>) {
    return UserJourneysCollection.upsert({ phone }, update);
  }
}

export const adminRepository = new AdminRepository();

