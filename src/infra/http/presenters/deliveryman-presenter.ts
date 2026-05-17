import { DeliveryMan } from '@/domain/enterprise/entitites/deliveryman';

export class DeliveryManPresenter {
  static toHTTP(deliveryman: DeliveryMan) {
    return {
      id: deliveryman.id.toString(),
      name: deliveryman.name,
      cpf: deliveryman.cpf,
      role: deliveryman.role,
    };
  }
}
