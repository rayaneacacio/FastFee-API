import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles.decorator';
import { UpdateRecipientUseCase } from '@/domain/application/use-cases/update-recipient';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { RecipientAlreadyExistsError } from '@/domain/application/use-cases/errors/recipient-already-exists';
import { RecipientNotFoundError } from '@/domain/application/use-cases/errors/recipient-not-found-error';

const updateRecipientBodySchema = z.object({
  name: z.string().optional(),
  email: z.string().email('E-mail inválido').optional(),
  street: z.string().optional(),
  number: z.string().optional(),
  neighborhood: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

type UpdateRecipientBodySchema = z.infer<typeof updateRecipientBodySchema>;

@Controller('/recipient')
export class UpdateRecipientController {
  constructor(private updateRecipient: UpdateRecipientUseCase) {}

  @Put(':id')
  @HttpCode(204)
  @Roles('ADMIN')
  async handle(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateRecipientBodySchema))
    body: UpdateRecipientBodySchema,
  ) {
    const result = await this.updateRecipient.execute({
      id,
      ...body,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case RecipientNotFoundError:
          throw new NotFoundException(error.message);
        case RecipientAlreadyExistsError:
          throw new ConflictException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
