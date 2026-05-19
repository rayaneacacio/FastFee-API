import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { DeliveryManRepository } from '../repositories/deliveryman-repository';
import { DeliverymanNotFoundError } from './errors/deliveryman-not-found-error';
import { compare, hash } from 'bcryptjs';
import { AdminRepository } from '../repositories/admin-repository';
import { WrongCredentialsError } from './errors/wrong-credentials-error';

interface ChangePasswordUseCaseRequest {
  cpf: string;
  password: string;
  newPassword: string;
}

// eslint-disable-next-line @typescript-eslint/ban-types
type ChangePasswordUseCaseResponse = Either<DeliverymanNotFoundError, {}>;

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    private deliverymanRepository: DeliveryManRepository,
    private adminRepository: AdminRepository,
  ) {}

  async execute({
    cpf,
    password,
    newPassword,
  }: ChangePasswordUseCaseRequest): Promise<ChangePasswordUseCaseResponse> {
    const deliveryman = await this.deliverymanRepository.findByCPF(cpf);
    const admin = await this.adminRepository.findByCPF(cpf);

    if (!deliveryman && !admin) return left(new WrongCredentialsError());

    const hashedPassword = await hash(newPassword, 8);

    if (deliveryman) {
      const isPasswordValid = await compare(password, deliveryman.password);

      if (!isPasswordValid) return left(new WrongCredentialsError());

      await this.deliverymanRepository.changePassword(cpf, hashedPassword);
    }

    if (admin) {
      const isPasswordValid = await compare(password, admin.password);

      if (!isPasswordValid) return left(new WrongCredentialsError());

      await this.adminRepository.changePassword(cpf, hashedPassword);
    }

    return right({});
  }
}
