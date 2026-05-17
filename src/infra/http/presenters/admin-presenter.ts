import { Admin } from '@/domain/enterprise/entitites/admin';

export class AdminPresenter {
  static toHTTP(admin: Admin) {
    return {
      id: admin.id.toString(),
      name: admin.name,
      cpf: admin.cpf,
      role: admin.role,
    };
  }
}
