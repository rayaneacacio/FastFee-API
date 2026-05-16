import { Admin } from '@/domain/enterprise/entitites/admin';

export abstract class AdminRepository {
  abstract create(admin: Admin): Promise<void>;
  abstract findByCPF(cpf: string): Promise<Admin | null>;
  abstract delete(cpf: string): Promise<void>;
}
