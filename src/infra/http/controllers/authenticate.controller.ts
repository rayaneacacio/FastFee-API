import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { z } from 'zod';
import { WrongCredentialsError } from '@/domain/application/use-cases/errors/wrong-credentials-error';
import { Public } from '@/infra/auth/public';
import { AuthenticateUseCase } from '@/domain/application/use-cases/authenticate';
import isValidCPF from '@/utils/is-valid-CPF';

const authenticateBodySchema = z.object({
  cpf: z.string().refine(isValidCPF, {
    message: 'CPF inválido',
  }),
  password: z.string(),
});

type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;

@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticate: AuthenticateUseCase) {}

  @Post()
  @HttpCode(200)
  @UsePipes(new ZodValidationPipe(authenticateBodySchema))
  async handle(@Body() body: AuthenticateBodySchema) {
    const { cpf, password } = body;

    const result = await this.authenticate.execute({
      cpf,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const { accessToken } = result.value;

    return {
      access_token: accessToken,
    };
  }
}
