import { Controller, Put, Param, ParseIntPipe, UseGuards, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/currentUser.decorator';
import { PayTeacherInvoiceUsecase } from './payTeacherInvoice.usecase';
import { PayTeacherInvoiceCommand } from './payTeacherInvoice.command';

@Controller()
export class PayTeacherInvoiceController {
  constructor(private readonly payTeacherInvoiceUsecase: PayTeacherInvoiceUsecase) {}

  @Put('/pay-teacher-invoice/:id')
  @UseGuards(JwtAuthGuard)
  async payTeacherInvoice(
    @CurrentUser() user: any, 
    @Param('id', ParseIntPipe) id: number,
    @Body() body: unknown,
    @Res() res: Response
  ) {

    if (typeof body !== 'object' || body === null) {
        return res.status(422).json({ message: "Les données de la facture sont obligatoires" });
    }

    if (!('teacherInvoiceId' in body) || typeof (body as any).teacherInvoiceId !== 'number') {
      return res.status(422).json({ message: "L'identifiant de la facture est obligatoire" });
    }


    try {
      await this.payTeacherInvoiceUsecase.execute(user.id, { teacherInvoiceId: id });
      return res.status(200).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      return res.status(422).json({ message });
    }
  }
}