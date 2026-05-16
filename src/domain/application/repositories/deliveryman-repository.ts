import { DeliveryMan } from '@/domain/enterprise/entitites/deliveryman';

export abstract class DeliveryManRepository {
  abstract create(deliveryman: DeliveryMan): Promise<void>;
  abstract findByCPF(cpf: string): Promise<DeliveryMan | null>;
  abstract delete(cpf: string): Promise<void>;
  abstract save(deliveryMan: DeliveryMan): Promise<void>;
}
