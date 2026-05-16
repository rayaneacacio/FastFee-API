import { DomainEvents } from '@/core/events/domain-events';
import { AdminRepository } from '@/domain/application/repositories/admin-repository';
import { Admin } from '@/domain/enterprise/entitites/admin';

export class InMemoryAdminRepository implements AdminRepository {
  public items: Admin[] = [];

  async findByCPF(cpf: string) {
    const admin = this.items.find((item) => item.cpf === cpf);

    if (!admin) return null;

    return admin;
  }

  async create(admin: Admin) {
    this.items.push(admin);

    DomainEvents.dispatchEventsForAggregate(admin.id);
  }
}
