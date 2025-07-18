import {Controller, Get, Res, Param, UseGuards} from "@nestjs/common";
import { Response } from "express";
import {PayTeacherInvoiceUsecase} from "./payTeacherInvoice.usecase";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {CurrentUser} from "../../auth/currentUser.decorator";

@Controller()
export class PayTeacherInvoiceController {

    constructor(private readonly payTeacherInvoiceUsecase: PayTeacherInvoiceUsecase) {}

    @Get('/pay-teacher-invoice/:teacherId/:amount')
    async payTeacherInvoice(
        @Param('teacherId') teacherId: number,
        @Param('amount') amount: number,
        @Res() res: Response
    ) {


        console.log('testing payTeacherInvoice endpoint');
        try {
            await this.payTeacherInvoiceUsecase.execute(2, {
                teacherId,
                amount
            });
            return res.status(200).send();

        } catch (error) {
            if (error instanceof Error) {
                return res.status(422).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
