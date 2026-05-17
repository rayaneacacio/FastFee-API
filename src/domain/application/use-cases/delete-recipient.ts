import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { RecipientNotFoundError } from './errors/recipient-not-found-error';
import { RecipientRepository } from '../repositories/recipient-repository';

interface DeleteRecipientUseCaseRequest {
  email: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type DeleteRecipientUseCaseResponse = Either<RecipientNotFoundError, {}>;

@Injectable()
export class DeleteRecipientUseCase {
  constructor(private recipientRepository: RecipientRepository) {}

  async execute({
    email,
  }: DeleteRecipientUseCaseRequest): Promise<DeleteRecipientUseCaseResponse> {
    const recipient = await this.recipientRepository.findByEmail(email);

    if (!recipient) return left(new RecipientNotFoundError());

    await this.recipientRepository.delete(recipient.email);

    return right({});
  }
}
