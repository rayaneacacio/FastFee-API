import { Recipient } from '@/domain/enterprise/entitites/recipient';

export abstract class RecipientRepository {
  abstract create(recipient: Recipient): Promise<void>;
  abstract findById(id: string): Promise<Recipient | null>;
  abstract findByEmail(email: string): Promise<Recipient | null>;
  abstract save(recipient: Recipient): Promise<void>;
  abstract delete(email: string): Promise<void>;
}
