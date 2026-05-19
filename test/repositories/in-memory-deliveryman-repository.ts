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

  async delete(cpf: string) {
    this.items = this.items.filter((item) => item.cpf !== cpf);
  }

  async save(deliveryMan: DeliveryMan): Promise<void> {
    const itemIndex = this.items.findIndex(
      (item) => item.id === deliveryMan.id,
    );

    if (itemIndex >= 0) this.items[itemIndex] = deliveryMan;
  }

  async changePassword(cpf: string, password: string) {
    const itemIndex = this.items.findIndex((item) => item.cpf === cpf);

    if (itemIndex >= 0) this.items[itemIndex].password = password;
  }
}
