import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { UpdateRecipientUseCase } from './update-recipient';
import { makeRecipient } from 'test/factories/make-recipient';
import { RecipientNotFoundError } from './errors/recipient-not-found-error';
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists';
import { faker } from '@faker-js/faker';

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: UpdateRecipientUseCase;

describe('Update Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    sut = new UpdateRecipientUseCase(inMemoryRecipientRepository);
  });

  it('should be able to update a recipient', async () => {
    const recipient = makeRecipient();
    await inMemoryRecipientRepository.create(recipient);

    const newDataRecipient = {
      id: recipient.id.toString(),
      name: faker.person.fullName(),
      city: faker.location.city(),
    };

    const result = await sut.execute(newDataRecipient);

    expect(result.isRight()).toBe(true);
    expect(inMemoryRecipientRepository.items[0].name).toEqual(
      newDataRecipient.name,
    );
    expect(inMemoryRecipientRepository.items[0].city).toEqual(
      newDataRecipient.city,
    );
    expect(inMemoryRecipientRepository.items[0].email).toEqual(recipient.email);
  });

  it('should not be able to update a non-existing recipient', async () => {
    const result = await sut.execute({
      id: 'non-existing-id',
      name: faker.person.fullName(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RecipientNotFoundError);
  });

  it('should not be able to update to an email that is already taken by another recipient', async () => {
    const recipient1 = makeRecipient({ email: faker.internet.email() });
    const recipient2 = makeRecipient({ email: faker.internet.email() });

    await inMemoryRecipientRepository.create(recipient1);
    await inMemoryRecipientRepository.create(recipient2);

    const result = await sut.execute({
      id: recipient2.id.toString(),
      email: recipient1.email,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RecipientAlreadyExistsError);
  });
});
