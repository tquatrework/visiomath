import {Controller, Get, UseGuards, Res} from "@nestjs/common";
import {Response} from "express";
import {GetCurrentTeacherInvoicesUsecase} from "./getCurrentTeacherInvoices.usecase";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {CurrentUser} from "../../auth/currentUser.decorator";

@Controller()
@UseGuards(JwtAuthGuard)
export class GetCurrentTeacherInvoicesController {

    constructor(private readonly getCurrentTeacherInvoicesUsecase: GetCurrentTeacherInvoicesUsecase) {}

    @Get('/current-teacher-invoices')
    async getCurrentTeacherInvoices(
        @CurrentUser() user: { id: number },
        @Res() res: Response
    ) {
        try {
            const result = await this.getCurrentTeacherInvoicesUsecase.execute(user.id);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(422).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}