import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { DeliveryManRepository } from '../repositories/deliveryman-repository';
import { DeliverymanNotFoundError } from './errors/deliveryman-not-found-error';
import { hash } from 'bcryptjs';

interface UpdateDeliverymanUseCaseRequest {
  cpf: string;
  name?: string;
  password?: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type UpdateDeliverymanUseCaseResponse = Either<DeliverymanNotFoundError, {}>;

@Injectable()
export class UpdateDeliverymanUseCase {
  constructor(private deliverymanRepository: DeliveryManRepository) {}

  async execute({
    cpf,
    name,
    password,
  }: UpdateDeliverymanUseCaseRequest): Promise<UpdateDeliverymanUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findByCPF(cpf);

    if (!deliveryman) return left(new DeliverymanNotFoundError());

    if (name) deliveryman.name = name;

    if (password) deliveryman.password = await hash(password, 8);

    await this.deliverymanRepository.save(deliveryman);

    return right({});
  }
}
