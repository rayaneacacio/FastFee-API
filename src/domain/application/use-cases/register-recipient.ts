import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { Recipient } from '@/domain/enterprise/entitites/recipient';
import { RecipientRepository } from '../repositories/recipient-repository';
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists';

interface RegisterRecipientUseCaseRequest {
  name: string;
  email: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
}

type RegisterRecipientUseCaseResponse = Either<
  RecipientAlreadyExistsError,
  { recipient: Recipient }
>;

@Injectable()
export class RegisterRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    name,
    email,
    street,
    number,
    neighborhood,
    city,
    state,
    zipCode,
    latitude,
    longitude,
  }: RegisterRecipientUseCaseRequest): Promise<RegisterRecipientUseCaseResponse> {
    const recipientWithSameEmail =
      await this.recipientRepository.findByEmail(email);

    if (recipientWithSameEmail) {
      return left(new RecipientAlreadyExistsError(email));
    }

    const recipient = Recipient.create({
      name,
      email,
      street,
      number,
      neighborhood,
      city,
      state,
      zipCode,
      latitude,
      longitude,
    });

    await this.recipientRepository.create(recipient);

    return right({ recipient });
  }
}
