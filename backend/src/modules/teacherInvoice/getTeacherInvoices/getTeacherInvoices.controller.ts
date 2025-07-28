import { Controller, Get, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/currentUser.decorator';
import { GetTeacherInvoicesUsecase } from './getTeacherInvoices.usecase';

@Controller()
export class GetTeacherInvoicesController {
  constructor(private readonly getTeacherInvoicesUsecase: GetTeacherInvoicesUsecase) {}

  @Get('/get-teacher-invoices')
  @UseGuards(JwtAuthGuard)
  async getTeacherInvoices(@CurrentUser() user: any, @Res() res: Response) {
    try {
      const result = await this.getTeacherInvoicesUsecase.execute(user.id);
      return res.status(200).json(result.teacherInvoices);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      return res.status(422).json({ message });
    }
  }
}