import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  Post,
  UsePipes,
} from '@nestjs/common';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { Roles } from '@/infra/auth/roles.decorator';
import { AdminAlreadyExistsError } from '@/domain/application/use-cases/errors/admin-already-exists';
import { RegisterAdminUseCase } from '@/domain/application/use-cases/register-admin';
import isValidCPF from '@/utils/is-valid-CPF';

const registerAdminBodySchema = z.object({
  name: z.string(),
  cpf: z.string().refine(isValidCPF, {
    message: 'CPF inválido',
  }),

  password: z.string(),
});

type RegisterAdminBodySchema = z.infer<typeof registerAdminBodySchema>;

@Controller('/admin')
export class RegisterAdminController {
  constructor(private registerAdmin: RegisterAdminUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles('ADMIN')
  @UsePipes(new ZodValidationPipe(registerAdminBodySchema))
  async handle(@Body() body: RegisterAdminBodySchema) {
    const { name, cpf, password } = body;

    const result = await this.registerAdmin.execute({
      name,
      cpf,
      password,
    });
    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case AdminAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
