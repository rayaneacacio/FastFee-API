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
import { RegisterDeliveryManUseCase } from '@/domain/application/use-cases/register-deliveryman';
import { DeliveryManAlreadyExistsError } from '@/domain/application/use-cases/errors/delivery-man-already-exists';
import { Roles } from '@/infra/auth/roles.decorator';

const registerDeliveryManBodySchema = z.object({
  name: z.string(),
  cpf: z.string(),
  password: z.string(),
});

type RegisterDeliveryManBodySchema = z.infer<
  typeof registerDeliveryManBodySchema
>;

@Controller('/deliveryman')
export class RegisterDeliveryManController {
  constructor(private registerDeliveryMan: RegisterDeliveryManUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles('ADMIN')
  @UsePipes(new ZodValidationPipe(registerDeliveryManBodySchema))
  async handle(@Body() body: RegisterDeliveryManBodySchema) {
    const { name, cpf, password } = body;

    const result = await this.registerDeliveryMan.execute({
      name,
      cpf,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case DeliveryManAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
