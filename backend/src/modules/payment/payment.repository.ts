import { IPaymentRecord, PaymentsCollection } from '../../shared/db/dbStore';
import { BaseRepository } from '../../shared/repositories/baseRepository';

export class PaymentRepository extends BaseRepository<IPaymentRecord> {
  constructor() {
    super(PaymentsCollection);
  }
}

export const paymentRepository = new PaymentRepository();

