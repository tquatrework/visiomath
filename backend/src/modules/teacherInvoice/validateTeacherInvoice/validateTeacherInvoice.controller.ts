import { Controller, Put, Param, ParseIntPipe, UseGuards, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/currentUser.decorator';
import { ValidateTeacherInvoiceUsecase } from './validateTeacherInvoice.usecase';
import { ValidateTeacherInvoiceCommand } from './validateTeacherInvoice.command';

@Controller()
export class ValidateTeacherInvoiceController {
  constructor(private readonly validateTeacherInvoiceUsecase: ValidateTeacherInvoiceUsecase) {}

  @Put('/validate-teacher-invoice/:id')
  @UseGuards(JwtAuthGuard)
  async validateTeacherInvoice(
    @CurrentUser() user: any, 
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ValidateTeacherInvoiceCommand,
    @Res() res: Response
  ) {
    try {
      await this.validateTeacherInvoiceUsecase.execute(user.id, { invoiceId: id });
      return res.status(200).send();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      return res.status(422).json({ message });
    }
  }
}