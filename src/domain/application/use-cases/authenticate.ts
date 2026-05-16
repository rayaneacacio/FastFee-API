import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { HashComparer } from '../cryptography/hash-comparer';
import { Encrypter } from '../cryptography/encrypter';
import { WrongCredentialsError } from './errors/wrong-credentials-error';
import { AdminRepository } from '../repositories/admin-repository';
import { DeliveryManRepository } from '../repositories/deliveryman-repository';

interface AuthenticateUseCaseRequest {
  cpf: string;
  password: string;
}

type AuthenticateUseCaseResponse = Either<
  WrongCredentialsError,
  {
    accessToken: string;
  }
>;

@Injectable()
export class AuthenticateUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private deliveryManRepository: DeliveryManRepository,
    private hashComparer: HashComparer,
    private encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateUseCaseRequest): Promise<AuthenticateUseCaseResponse> {
    const admin = await this.adminRepository.findByCPF(cpf);

    const deliveryMan = !admin
      ? await this.deliveryManRepository.findByCPF(cpf)
      : null;

    const user = admin ?? deliveryMan;

    if (!user) return left(new WrongCredentialsError());

    const isPasswordValid = await this.hashComparer.compare(
      password,
      user.password,
    );

    if (!isPasswordValid) return left(new WrongCredentialsError());

    const accessToken = await this.encrypter.encrypt({
      sub: user.id.toString(),
      role: user.role.toString(),
    });

    return right({
      accessToken,
    });
  }
}
