import { Either, left, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { HashGenerator } from '../cryptography/hash-generator';
import { AdminAlreadyExistsError } from './errors/admin-already-exists';
import { AdminRepository } from '../repositories/admin-repository';
import { Admin } from '@/domain/enterprise/entitites/admin';

interface RegisterAdminUseCaseRequest {
  name: string;
  cpf: string;
  password: string;
}

type RegisterAdminUseCaseResponse = Either<
  AdminAlreadyExistsError,
  {
    admin: Admin;
  }
>;

@Injectable()
export class RegisterAdminUseCase {
  constructor(
    private adminRepository: AdminRepository,
    private hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: RegisterAdminUseCaseRequest): Promise<RegisterAdminUseCaseResponse> {
    const adminWithSamecpf = await this.adminRepository.findByCPF(cpf);

    if (adminWithSamecpf) return left(new AdminAlreadyExistsError(cpf));

    const hashedPassword = await this.hashGenerator.hash(password);

    const admin = Admin.create({
      name,
      cpf,
      password: hashedPassword,
      role: 'ADMIN',
    });

    await this.adminRepository.create(admin);

    return right({
      admin,
    });
  }
}
