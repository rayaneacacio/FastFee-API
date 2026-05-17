import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { DeleteRecipientUseCase } from './delete-recipient';
import { makeRecipient } from 'test/factories/make-recipient';
import { RecipientNotFoundError } from './errors/recipient-not-found-error';
import { faker } from '@faker-js/faker';

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: DeleteRecipientUseCase;

describe('Delete Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    sut = new DeleteRecipientUseCase(inMemoryRecipientRepository);
  });

  it('should be able to delete a recipient by email', async () => {
    const email = faker.internet.email();

    const recipient = makeRecipient({ email });
    await inMemoryRecipientRepository.create(recipient);

    const result = await sut.execute({
      email,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryRecipientRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a non-existing recipient', async () => {
    const result = await sut.execute({
      email: faker.internet.email(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RecipientNotFoundError);
  });
});
