import { UpdateDeliverymanUseCase } from './update-deliveryman';
import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-deliveryman-repository';
import { makeDeliveryMan } from 'test/factories/make-deliveryman';
import { DeliverymanNotFoundError } from './errors/deliveryman-not-found-error';
import { compare } from 'bcryptjs';
import generateCPF from 'test/utils/generate-CPF';
import { faker } from '@faker-js/faker';

let inMemoryDeliverymanRepository: InMemoryDeliveryManRepository;
let sut: UpdateDeliverymanUseCase;

describe('Update Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliveryManRepository();

    sut = new UpdateDeliverymanUseCase(inMemoryDeliverymanRepository);
  });

  it('should be able to update a deliveryman name and password', async () => {
    const deliveryman = makeDeliveryMan({
      name: faker.person.fullName(),
      password: '123456',
    });

    await inMemoryDeliverymanRepository.create(deliveryman);

    const newName = faker.person.fullName();
    const newPassowrd = '132456';

    const result = await sut.execute({
      cpf: deliveryman.cpf,
      name: newName,
      password: newPassowrd,
    });

    expect(result.isRight()).toBe(true);

    expect(inMemoryDeliverymanRepository.items[0].name).toBe(newName);

    expect(inMemoryDeliverymanRepository.items[0].password).not.toBe(
      newPassowrd,
    );

    const isPasswordHashedCorrectly = await compare(
      newPassowrd,
      inMemoryDeliverymanRepository.items[0].password,
    );
    expect(isPasswordHashedCorrectly).toBe(true);
  });

  it('should be able to update only the deliveryman name (partial update)', async () => {
    const samePassword = '123456';

    const deliveryman = makeDeliveryMan({
      name: faker.person.fullName(),
      password: samePassword,
    });

    await inMemoryDeliverymanRepository.create(deliveryman);

    const newName = faker.person.fullName();

    const result = await sut.execute({
      cpf: deliveryman.cpf,
      name: newName,
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryDeliverymanRepository.items[0].name).toBe(newName);
    expect(inMemoryDeliverymanRepository.items[0].password).toBe(samePassword);
  });

  it('should not be able to update a deliveryman that does not exist', async () => {
    const nonExistingCpf = generateCPF();

    const result = await sut.execute({
      cpf: nonExistingCpf,
      name: faker.person.fullName(),
    });

    expect(result.isLeft()).toBe(true);

    expect(result.value).toBeInstanceOf(DeliverymanNotFoundError);
  });
});
