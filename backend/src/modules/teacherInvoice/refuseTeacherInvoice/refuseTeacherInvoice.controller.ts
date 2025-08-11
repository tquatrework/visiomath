import { Controller, Put, Param, ParseIntPipe, UseGuards, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/currentUser.decorator';
import { RefuseTeacherInvoiceUsecase } from './refuseTeacherInvoice.usecase';
import { RefuseTeacherInvoiceCommand } from './refuseTeacherInvoice.command';

@Controller()
export class RefuseTeacherInvoiceController {
  constructor(private readonly refuseTeacherInvoiceUsecase: RefuseTeacherInvoiceUsecase) {}

  @Put('/refuse-teacher-invoice/:id')
  @UseGuards(JwtAuthGuard)
  async refuseTeacherInvoice(
    @CurrentUser() user: any, 
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RefuseTeacherInvoiceCommand,
    @Res() res: Response
  ) {
    try {
      await this.refuseTeacherInvoiceUsecase.execute(user.id, { invoiceId: id, refusalReason: body.refusalReason });
      return res.status(200).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      return res.status(422).json({ message });
    }
  }
}