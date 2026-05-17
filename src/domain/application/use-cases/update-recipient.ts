import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Recipient } from '@/domain/enterprise/entitites/recipient';
import { RecipientRepository } from '../repositories/recipient-repository';
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists';
import { RecipientNotFoundError } from './errors/recipient-not-found-error';

interface UpdateRecipientUseCaseRequest {
  id: string;
  name?: string;
  email?: string;
  street?: string;
  number?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
}

type UpdateRecipientUseCaseResponse = Either<
  RecipientNotFoundError | RecipientAlreadyExistsError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class UpdateRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute(
    request: UpdateRecipientUseCaseRequest,
  ): Promise<UpdateRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findById(request.id);

    if (!recipient) {
      return left(new RecipientNotFoundError());
    }

    if (request.email && request.email !== recipient.email) {
      const emailExists = await this.recipientRepository.findByEmail(
        request.email,
      );

      if (emailExists)
        return left(new RecipientAlreadyExistsError(request.email));
    }

    if (request.name) recipient.name = request.name;
    if (request.email) recipient.email = request.email;
    if (request.street) recipient.street = request.street;
    if (request.number) recipient.number = request.number;
    if (request.neighborhood) recipient.neighborhood = request.neighborhood;
    if (request.city) recipient.city = request.city;
    if (request.state) recipient.state = request.state;
    if (request.zipCode) recipient.zipCode = request.zipCode;
    if (request.latitude !== undefined) recipient.latitude = request.latitude;
    if (request.longitude !== undefined)
      recipient.longitude = request.longitude;

    await this.recipientRepository.save(recipient);

    return right({
      recipient,
    });
  }
}
