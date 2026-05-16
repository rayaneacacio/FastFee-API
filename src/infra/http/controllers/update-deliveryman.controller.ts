import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { Roles } from '@/infra/auth/roles.decorator';
import { UpdateDeliverymanUseCase } from '@/domain/application/use-cases/update-deliveryman';
import { z } from 'zod';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

const updateDeliverymanBodySchema = z.object({
  name: z.string().optional(),
  password: z.string().min(6).optional(),
});

type UpdateDeliverymanBodySchema = z.infer<typeof updateDeliverymanBodySchema>;

@Controller('/deliveryman')
export class UpdateDeliverymanController {
  constructor(private updateDeliveryman: UpdateDeliverymanUseCase) {}

  @Put(':cpf')
  @HttpCode(204)
  @Roles('ADMIN')
  async handle(
    @Param('cpf') cpf: string,
    @Body(new ZodValidationPipe(updateDeliverymanBodySchema))
    body: UpdateDeliverymanBodySchema,
  ) {
    const { name, password } = body;

    const result = await this.updateDeliveryman.execute({
      cpf,
      name,
      password,
    });

    if (result.isLeft()) {
      const error = result.value;
      throw new BadRequestException(error.message);
    }
  }
}
