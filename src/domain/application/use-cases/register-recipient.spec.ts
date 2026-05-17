import { InMemoryRecipientRepository } from 'test/repositories/in-memory-recipient-repository';
import { RegisterRecipientUseCase } from './register-recipient';
import { RecipientAlreadyExistsError } from './errors/recipient-already-exists';
import { makeRecipient } from 'test/factories/make-recipient';
import { faker } from '@faker-js/faker';
import { RecipientPresenter } from '@/infra/http/presenters/recipient-presenter';

let inMemoryRecipientRepository: InMemoryRecipientRepository;
let sut: RegisterRecipientUseCase;

describe('Register Recipient', () => {
  beforeEach(() => {
    inMemoryRecipientRepository = new InMemoryRecipientRepository();
    sut = new RegisterRecipientUseCase(inMemoryRecipientRepository);
  });

  it('should be able to register a new recipient', async () => {
    const recipient = makeRecipient();

    const result = await sut.execute(RecipientPresenter.toHTTP(recipient));

    expect(result.isRight()).toBe(true);

    if (result.isRight())
      expect(result.value?.recipient.email).toEqual(recipient.email);
  });

  it('should not be able to register a recipient with an existing email', async () => {
    const email = faker.internet.email();

    const recipient = makeRecipient({ email });

    await sut.execute(RecipientPresenter.toHTTP(recipient));

    const otherRecipient = makeRecipient({ email });

    const result = await sut.execute(RecipientPresenter.toHTTP(otherRecipient));

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(RecipientAlreadyExistsError);
  });
});
