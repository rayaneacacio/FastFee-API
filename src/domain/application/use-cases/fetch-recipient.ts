import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { RecipientRepository } from '../repositories/recipient-repository';
import { Recipient } from '@/domain/enterprise/entitites/recipient';
import { RecipientNotFoundError } from './errors/recipient-not-found-error';

interface FetchRecipientUseCaseRequest {
  email: string;
}

type FetchRecipientUseCaseResponse = Either<
  RecipientNotFoundError,
  {
    recipient: Recipient;
  }
>;

@Injectable()
export class FetchRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    email,
  }: FetchRecipientUseCaseRequest): Promise<FetchRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findByEmail(email);

    if (!recipient) return left(new RecipientNotFoundError());

    return right({
      recipient,
    });
  }
}
