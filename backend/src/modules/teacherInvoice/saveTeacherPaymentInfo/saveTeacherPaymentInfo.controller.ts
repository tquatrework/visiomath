import {Controller, Post, Res, Body, UseGuards} from "@nestjs/common";
import { Response } from "express";
import {SaveTeacherPaymentInfoUsecase} from "./saveTeacherPaymentInfo.usecase";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {CurrentUser} from "../../auth/currentUser.decorator";

@Controller()
@UseGuards(JwtAuthGuard)
export class saveTeacherPaymentInfoController {

    constructor(private readonly saveTeacherPaymentInfoUsecase: SaveTeacherPaymentInfoUsecase) {}

    @Post('/teacher-payment-info')
    async saveTeacherPaymentInfo(
        @Body() body: any,
        @CurrentUser() user: { id: number },
        @Res() res: Response
    ) {

        if (typeof body !== "object" || typeof body.companyName !== 'string' || typeof body.siret !== 'string' ||
            typeof body.companyType !== 'string' || typeof body.iban !== 'string' ||
            typeof body.bic !== 'string' || typeof body.vatExempt !== 'boolean') {
            return res.status(422).json({ message : 'Des données sont manquantes' });
        }

        try {
            await this.saveTeacherPaymentInfoUsecase.execute(user.id, body);
            return res.status(201).send();

        } catch (error) {
            if (error instanceof Error) {
                return res.status(422).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}