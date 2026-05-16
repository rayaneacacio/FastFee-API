import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { HashGenerator } from '../cryptography/hash-generator';
import { DeliveryMan } from '@/domain/enterprise/entitites/deliveryman';
import { DeliveryManRepository } from '../repositories/deliveryman-repository';
import { DeliveryManAlreadyExistsError } from './errors/delivery-man-already-exists';

interface RegisterDeliveryManUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
}

type RegisterDeliveryManUseCaseResponse = Either<
  DeliveryManAlreadyExistsError,
  {
    deliveryMan: DeliveryMan;
  }
>;

@Injectable()
export class RegisterDeliveryManUseCase {
  constructor(
    private deliveryManRepository: DeliveryManRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterDeliveryManUseCaseRequest): Promise<RegisterDeliveryManUseCaseResponse> {
    const deliveryManWithSamecpf =
      await this.deliveryManRepository.findByCPF(cpf);

    if (deliveryManWithSamecpf)
      return left(new DeliveryManAlreadyExistsError(cpf));

    const hashedPassword = await this.hashGenerator.hash(password);

    const deliveryMan = DeliveryMan.create({
      name,
      cpf,
      password: hashedPassword,
      role: 'DELIVERYMAN',
    });

    await this.deliveryManRepository.create(deliveryMan);

    return right({
      deliveryMan,
    });
  }
}
