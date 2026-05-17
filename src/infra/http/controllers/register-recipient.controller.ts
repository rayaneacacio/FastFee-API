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
import { RegisterRecipientUseCase } from '@/domain/application/use-cases/register-recipient';
import { RecipientAlreadyExistsError } from '@/domain/application/use-cases/errors/recipient-already-exists';

const registerRecipientBodySchema = z.object({
  name: z.string(),
  email: z.string().email('E-mail inválido'),
  street: z.string(),
  number: z.string(),
  neighborhood: z.string(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

type RegisterRecipientBodySchema = z.infer<typeof registerRecipientBodySchema>;

@Controller('/recipient')
export class RegisterRecipientController {
  constructor(private registerRecipient: RegisterRecipientUseCase) {}

  @Post()
  @HttpCode(201)
  @Roles('ADMIN')
  @UsePipes(new ZodValidationPipe(registerRecipientBodySchema))
  async handle(@Body() body: RegisterRecipientBodySchema) {
    const {
      name,
      email,
      street,
      number,
      neighborhood,
      city,
      state,
      zipCode,
      latitude,
      longitude,
    } = body;

    const result = await this.registerRecipient.execute({
      name,
      email,
      street,
      number,
      neighborhood,
      city,
      state,
      zipCode,
      latitude,
      longitude,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case RecipientAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
