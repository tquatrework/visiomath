import { Controller, Put, Param, ParseIntPipe, UseGuards, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/currentUser.decorator';
import { RefuseTeacherInvoiceUsecase } from './refuseTeacherInvoice.usecase';

@Controller()
export class RefuseTeacherInvoiceController {
  constructor(private readonly refuseTeacherInvoiceUsecase: RefuseTeacherInvoiceUsecase) {}

  @Put('/refuse-teacher-invoice/:id')
  @UseGuards(JwtAuthGuard)
  async refuseTeacherInvoice(
    @CurrentUser() user: any, 
    @Param('id', ParseIntPipe) id: number,
    @Body() body: unknown,
    @Res() res: Response
  ) {
    if (typeof body !== 'object' || body === null) {
      return res.status(422).json({ message: "Les données de la facture sont obligatoires" });
    }

    if (!('invoiceId' in body) || typeof (body as any).invoiceId !== 'number' || !(body as any).invoiceId) {
      return res.status(422).json({ message: "L'identifiant de la facture est obligatoire" });
    }

    if (!('refusalReason' in body) || typeof (body as any).refusalReason !== 'string' || !(body as any).refusalReason) {
      return res.status(422).json({ message: "La raison du refus est obligatoire" });
    }

    try {
      await this.refuseTeacherInvoiceUsecase.execute(user.id, { invoiceId: id, refusalReason: (body as any).refusalReason });
      return res.status(200).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      return res.status(422).json({ message });
    }
  }
}