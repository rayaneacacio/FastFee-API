import { InMemoryDeliveryManRepository } from 'test/repositories/in-memory-deliveryman-repository';
import { makeDeliveryMan } from 'test/factories/make-deliveryman';
import { DeliverymanNotFoundError } from './errors/deliveryman-not-found-error';
import { FetchDeliverymanUseCase } from './fetch-deliveryman';
import generateCPF from 'test/utils/generate-CPF';

let inMemoryDeliverymanRepository: InMemoryDeliveryManRepository;
let sut: FetchDeliverymanUseCase;

describe('Fetch Deliveryman', () => {
  beforeEach(() => {
    inMemoryDeliverymanRepository = new InMemoryDeliveryManRepository();

    sut = new FetchDeliverymanUseCase(inMemoryDeliverymanRepository);
  });

  it('should be able to fetch a deliveryman by cpf', async () => {
    const deliveryman = makeDeliveryMan();

    await inMemoryDeliverymanRepository.create(deliveryman);

    const result = await sut.execute({
      cpf: deliveryman.cpf,
    });

    expect(result.isRight()).toBe(true);

    expect(result.value).toEqual({
      deliveryman: expect.objectContaining({
        cpf: deliveryman.cpf,
      }),
    });
  });

  it('should not be able to fetch a deliveryman that does not exist', async () => {
    const nonExistingCpf = generateCPF();

    const result = await sut.execute({
      cpf: nonExistingCpf,
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(DeliverymanNotFoundError);
  });
});
