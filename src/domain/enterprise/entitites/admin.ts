import { Entity } from '@/core/entities/entity';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface AdminProps {
  name: string;
  cpf: string;
  password: string;
  role: 'ADMIN';
}

export class Admin extends Entity<AdminProps> {
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

  static create(props: AdminProps, id?: UniqueEntityID) {
    const admin = new Admin(props, id);

    return admin;
  }
}
