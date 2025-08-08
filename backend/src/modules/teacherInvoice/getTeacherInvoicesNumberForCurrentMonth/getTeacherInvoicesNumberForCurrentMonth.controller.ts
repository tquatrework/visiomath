import {Controller, Get, Res, UseGuards} from "@nestjs/common";
import {Response} from "express";
import {GetTeacherInvoicesNumberForCurrentMonthUsecase} from "./getTeacherInvoicesNumberForCurrentMonth.usecase";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {CurrentUser} from "../../auth/currentUser.decorator";

@Controller()
@UseGuards(JwtAuthGuard)
export class GetTeacherInvoicesNumberForCurrentMonthController {

    constructor(private readonly getTeacherInvoicesNumberForCurrentMonthUsecase: GetTeacherInvoicesNumberForCurrentMonthUsecase) {}

    @Get('/teacher-invoices/current-month/count')
    async getTeacherInvoicesNumberForCurrentMonth(
        @CurrentUser() user: { id: number },
        @Res() res: Response
    ) {

        try {
            const result = await this.getTeacherInvoicesNumberForCurrentMonthUsecase.execute(user.id);
            return res.status(200).json({ count: result.number });
        } catch (error) {
            if (error instanceof Error) {
                return res.status(422).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}