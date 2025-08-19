import {Controller, Post, Res, Body, UseGuards, UseInterceptors, UploadedFile} from "@nestjs/common";
import { Response } from "express";
import {CreateTeacherInvoiceUsecase} from "./createTeacherInvoice.usecase";
import {JwtAuthGuard} from "../../auth/guards/jwt-auth.guard";
import {CurrentUser} from "../../auth/currentUser.decorator";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller()
@UseGuards(JwtAuthGuard)
export class CreateTeacherInvoiceController {

    constructor(private readonly createTeacherInvoiceUsecase: CreateTeacherInvoiceUsecase) {}

    @Post('/create-teacher-invoice')
    @UseInterceptors(FileInterceptor('pdfFile'))
    async createTeacherInvoice(
        @Body('amount') amount: string,
        @Body('dueDate') dueDate: string,
        @UploadedFile() pdfFile: Express.Multer.File,
        @CurrentUser() user: { id: number },
        @Res() res: Response
    ) {
        if (typeof amount !== 'string' || !amount) {
            return res.status(422).json({ message: 'Le montant est obligatoire' });
        }

        if (!pdfFile) {
            return res.status(422).json({ message: 'La facture PDF est obligatoire' });
        }

        try {
            const amountValue = parseInt(amount, 10);
            await this.createTeacherInvoiceUsecase.execute({
                userId: user.id,
                amount: amountValue,
                pdfFileContent: pdfFile.buffer,
                dueDate: dueDate
            });
            
            return res.status(201).send();

        } catch (error) {
            if (error instanceof Error) {
                return res.status(422).json({ message: error.message });
            }
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}
