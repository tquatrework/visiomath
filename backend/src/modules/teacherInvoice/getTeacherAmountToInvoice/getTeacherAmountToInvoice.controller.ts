import {Controller, Get, Res, UseGuards, Param} from "@nestjs/common";
import {Response} from "express";
import {GetTeacherAmountToInvoiceUsecase} from "./getTeacherAmountToInvoice.usecase";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {CurrentUser} from "../../auth/currentUser.decorator";

@Controller()
@UseGuards(JwtAuthGuard)
export class GetTeacherAmountToInvoiceController {

    constructor(private readonly getTeacherAmountToInvoiceUsecase: GetTeacherAmountToInvoiceUsecase) {}

    @Get('/teacher-amount-to-invoice')
    async getTeacherAmountToInvoice(
        @CurrentUser() user: { id: number },
        @Res() res: Response
    ) {

        console.log("teacher amount to invoice controller called for user ID:", user.id);
        try {
            const result = await this.getTeacherAmountToInvoiceUsecase.execute(user.id);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
