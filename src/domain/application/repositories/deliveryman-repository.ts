import { DeliveryMan } from '@/domain/enterprise/entitites/deliveryman';

export abstract class DeliveryManRepository {
  abstract create(deliveryman: DeliveryMan): Promise<void>;
  abstract findByCPF(email: string): Promise<DeliveryMan | null>;
}
