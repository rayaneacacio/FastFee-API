import { FakeHasher } from 'test/cryptography/fake-hasher';
import { FakeEncrypter } from 'test/cryptography/fake-encrypter';
import { makeAdmin } from 'test/factories/make-admin';
import { InMemoryAdminRepository } from 'test/repositories/in-memory-admin-repository';
import { AuthenticateUseCase } from './authenticate';
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-deliveryman-repository';
import { makeDeliveryMan } from 'test/factories/make-deliveryman';

let inMemoryAdminRepository: InMemoryAdminRepository;
let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let fakeHasher: FakeHasher;
let encrypter: FakeEncrypter;

let sut: AuthenticateUseCase;

describe('Authenticate', () => {
  beforeEach(() => {
    inMemoryAdminRepository = new InMemoryAdminRepository();
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();
    fakeHasher = new FakeHasher();
    encrypter = new FakeEncrypter();

    sut = new AuthenticateUseCase(
      inMemoryAdminRepository,
      inMemoryDeliveryManRepository,
      fakeHasher,
      encrypter,
    );
  });

  it('should be able to authenticate admin', async () => {
    const admin = makeAdmin({
      cpf: '99999999999',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryAdminRepository.items.push(admin);

    const result = await sut.execute({
      cpf: '99999999999',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });

    if (result.isRight()) {
      const accessToken = JSON.parse(result.value.accessToken);

      expect(accessToken).toEqual({
        sub: expect.any(String),
        role: 'ADMIN',
      });
    }
  });

  it('should be able to authenticate deliveryman', async () => {
    const deliveryMan = makeDeliveryMan({
      cpf: '99999999999',
      password: await fakeHasher.hash('123456'),
    });

    inMemoryDeliveryManRepository.items.push(deliveryMan);

    const result = await sut.execute({
      cpf: '99999999999',
      password: '123456',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({
      accessToken: expect.any(String),
    });

    if (result.isRight()) {
      const accessToken = JSON.parse(result.value.accessToken);

      expect(accessToken).toEqual({
        sub: expect.any(String),
        role: 'DELIVERYMAN',
      });
    }
  });
});
