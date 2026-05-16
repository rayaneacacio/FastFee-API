import { FakeHasher } from 'test/cryptography/fake-hasher';
import { makeDeliveryMan } from 'test/factories/make-deliveryman';
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-deliveryman-repository';
import { RegisterDeliveryManUseCase } from './register-deliveryman';
import { DeliveryManAlreadyExistsError } from './errors/delivery-man-already-exists';
import generateCPF from 'test/utils/generate-CPF';

let inMemoryDeliveryManRepository: InMemoryDeliveryManRepository;
let fakeHasher: FakeHasher;

let sut: RegisterDeliveryManUseCase;

describe('Register DeliveryMan', () => {
  beforeEach(() => {
    inMemoryDeliveryManRepository = new InMemoryDeliveryManRepository();

    fakeHasher = new FakeHasher();

    sut = new RegisterDeliveryManUseCase(
      inMemoryDeliveryManRepository,
      fakeHasher,
    );
  });

  it('should be able to register deliveryman', async () => {
    const cpf = generateCPF();

    const result = await sut.execute({
      name: 'John Delivery',
      cpf,
      password: '123456',
    });

    expect(result.isRight()).toBe(true);

    expect(inMemoryDeliveryManRepository.items).toHaveLength(1);

    expect(inMemoryDeliveryManRepository.items[0]).toMatchObject({
      name: 'John Delivery',
      cpf,
    });
  });

  it('should hash deliveryman password on register', async () => {
    await sut.execute({
      name: 'John Delivery',
      cpf: generateCPF(),
      password: '123456',
    });

    const deliveryMan = inMemoryDeliveryManRepository.items[0];

    expect(deliveryMan.password).toEqual(await fakeHasher.hash('123456'));
  });

  it('should not be able to register deliveryman with same cpf', async () => {
    const cpf = generateCPF();

    const deliveryman = makeDeliveryMan({
      cpf,
    });

    await inMemoryDeliveryManRepository.create(deliveryman);

    const result = await sut.execute({
      name: 'John Delivery',
      cpf,
      password: '123456',
    });

    expect(result.isLeft()).toBe(true);

    expect(result.value).toBeInstanceOf(DeliveryManAlreadyExistsError);
  });
});
