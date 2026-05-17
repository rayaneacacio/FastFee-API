import { RecipientRepository } from '@/domain/application/repositories/recipient-repository';
import { Recipient } from '@/domain/enterprise/entitites/recipient';

export class InMemoryRecipientRepository implements RecipientRepository {
  public items: Recipient[] = [];

  async findById(id: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.id.toString() === id);

    if (!recipient) return null;

    return recipient;
  }

  async findByEmail(email: string): Promise<Recipient | null> {
    const recipient = this.items.find((item) => item.email === email);

    if (!recipient) return null;

    return recipient;
  }

  async create(recipient: Recipient): Promise<void> {
    this.items.push(recipient);
  }

  async save(recipient: Recipient): Promise<void> {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(recipient.id),
    );

    if (itemIndex >= 0) this.items[itemIndex] = recipient;
  }

  async delete(email: string): Promise<void> {
    const itemIndex = this.items.findIndex((item) => item.email === email);

    if (itemIndex >= 0) this.items.splice(itemIndex, 1);
  }
}
