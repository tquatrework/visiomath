import { Controller, Get, Param, ParseIntPipe, UseGuards, Res } from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/currentUser.decorator';
import { GetTeacherInvoiceDetailUsecase } from './getTeacherInvoiceDetail.usecase';

@Controller()
export class GetTeacherInvoiceDetailController {
  constructor(private readonly getTeacherInvoiceDetailUsecase: GetTeacherInvoiceDetailUsecase) {}

  @Get('/get-teacher-invoice/:id')
  @UseGuards(JwtAuthGuard)
  async getTeacherInvoiceDetail(@CurrentUser() user: any, @Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    try {
      const result = await this.getTeacherInvoiceDetailUsecase.execute(user.id, id);
      return res.status(200).json(result);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      return res.status(422).json({ message });
    }
  }
}