import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Patch,
  UnauthorizedException,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles.decorator';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import isValidCPF from '@/utils/is-valid-CPF';
import { ChangePasswordUseCase } from '@/domain/application/use-cases/change-password';
import { WrongCredentialsError } from '@/domain/application/use-cases/errors/wrong-credentials-error';

const changePasswordBodySchema = z.object({
  cpf: z.string().refine(isValidCPF, {
    message: 'CPF inválido',
  }),
  password: z.string(),
  newPassword: z.string(),
});

type ChangePasswordBodySchema = z.infer<typeof changePasswordBodySchema>;

@Controller('/update-password')
export class ChangePasswordController {
  constructor(private changePasswordUseCase: ChangePasswordUseCase) {}

  @Patch()
  @HttpCode(204)
  @Roles('ADMIN')
  async handle(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(changePasswordBodySchema))
    body: ChangePasswordBodySchema,
  ) {
    const result = await this.changePasswordUseCase.execute(body);

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
