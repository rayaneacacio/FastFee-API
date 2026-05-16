import { DomainEvents } from '@/core/events/domain-events';
import { DeliveryManRepository } from '@/domain/application/repositories/deliveryman-repository';
import { DeliveryMan } from '@/domain/enterprise/entitites/deliveryman';

export class InMemoryDeliveryManRepository implements DeliveryManRepository {
  public items: DeliveryMan[] = [];

  async findByCPF(cpf: string) {
    const deliveryMan = this.items.find((item) => item.cpf === cpf);

    if (!deliveryMan) return null;

    return deliveryMan;
  }

  async create(deliveryMan: DeliveryMan) {
    this.items.push(deliveryMan);

    DomainEvents.dispatchEventsForAggregate(deliveryMan.id);
  }
}
