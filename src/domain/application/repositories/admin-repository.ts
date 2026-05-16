import { Admin } from '@/domain/enterprise/entitites/admin';

export abstract class AdminRepository {
  abstract create(admin: Admin): Promise<void>;
  abstract findByCPF(email: string): Promise<Admin | null>;
}
