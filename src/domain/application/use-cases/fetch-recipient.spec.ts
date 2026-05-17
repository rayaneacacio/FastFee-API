import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { FetchRecipientUseCase } from './fetch-recipient';
import { makeRecipient } from 'test/factories/make-recipient';
import { RecipientNotFoundError } from './errors/recipient-not-found-error';
import { faker } from '@faker-js/faker';

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: FetchRecipientUseCase;

describe('Fetch Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    sut = new FetchRecipientUseCase(inMemoryRecipientRepository);
  });

  it('should be able to fetch a recipient by email', async () => {
    const email = faker.internet.email();

    const recipient = makeRecipient({ email });
    await inMemoryRecipientRepository.create(recipient);

    const result = await sut.execute({
      email,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      recipient: expect.objectContaining({
        email,
      }),
    });
  });

  it('should return a left error if recipient is not found', async () => {
    const result = await sut.execute({
      email: faker.internet.email(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RecipientNotFoundError);
  });
});
