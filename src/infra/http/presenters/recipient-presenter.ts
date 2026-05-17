import { Recipient } from '@/domain/enterprise/entitites/recipient';

export class RecipientPresenter {
  static toHTTP(recipient: Recipient) {
    return {
      id: recipient.id.toString(),
      name: recipient.name,
      email: recipient.email,
      street: recipient.street,
      number: recipient.number,
      neighborhood: recipient.neighborhood,
      city: recipient.city,
      state: recipient.state,
      zipCode: recipient.zipCode,
      latitude: recipient.latitude,
      longitude: recipient.longitude,
    };
  }
}
