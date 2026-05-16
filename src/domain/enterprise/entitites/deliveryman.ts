import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface DeliveryManProps {
  name: string;
  cpf: string;
  password: string;
  role: 'DELIVERYMAN';
}

export class DeliveryMan extends Entity<DeliveryManProps> {
  get name() {
    return this.props.name;
  }

  get cpf() {
    return this.props.cpf;
  }

  get password() {
    return this.props.password;
  }

  get role() {
    return this.props.role;
  }

  static create(props: DeliveryManProps, id?: UniqueEntityID) {
    const deliveryMan = new DeliveryMan(props, id);

    return deliveryMan;
  }
}
