import {Controller, Get, Res, UseGuards} from "@nestjs/common";
import {Response} from "express";
import {GetTeacherPaymentInfoUsecase} from "./getTeacherPaymentInfo.usecase";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {CurrentUser} from "../../auth/currentUser.decorator";

@Controller()
@UseGuards(JwtAuthGuard)
export class GetTeacherPaymentInfoController {

    constructor(private readonly getTeacherPaymentInfoUsecase: GetTeacherPaymentInfoUsecase) {}

    @Get('/teacher-payment-info')
    async getTeacherPaymentInfo(
        @CurrentUser() user: { id: number },
        @Res() res: Response
    ) {

        try {
            const result = await this.getTeacherPaymentInfoUsecase.execute(user.id);
            return res.status(200).json(result);
        } catch (error) {
            if (error instanceof Error) {
                return res.status(404).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
