import {PayTeacherInvoiceRepository} from "./payTeacherInvoice.repository";
import {PayTeacherInvoiceCommand} from "./payTeacherInvoice.command";
import {Inject} from "@nestjs/common";
import {
    SaveTeacherPaymentInfoTypeOrmRepository
} from "../saveTeacherPaymentInfo/saveTeacherPaymentInfo.typeOrmRepository";
import {SaveTeacherPaymentInfoRepository} from "../saveTeacherPaymentInfo/saveTeacherPaymentInfo.repository";
import {PayTeacherInvoiceTypeOrmRepository} from "./payTeacherInvoice.typeOrmRepository";

export class PayTeacherInvoiceUsecase {


    constructor(
        @Inject(PayTeacherInvoiceTypeOrmRepository)
    private payTeacherInvoiceRepository: PayTeacherInvoiceRepository
    ) {}

    async execute(financialAdminId: number, command: PayTeacherInvoiceCommand): Promise<void> {


//        const requester = await this.payTeacherInvoiceRepository.findUserById(financialAdminId);
//         if (!requester) {
//             throw new Error("Responsable financier non trouvé");
//         }
//         if (requester.role !== "financial_admin") {
//             throw new Error("vous ne pouvez pas accéder à cette opération");
//         }

        const teacher = await this.payTeacherInvoiceRepository.findUserByIdWithTeacherProfil(command.teacherId);
        if (!teacher) {
            throw new Error("Professeur non trouvé");
        }

        teacher.payTeacherInvoice(command.amount);
        await this.payTeacherInvoiceRepository.save(teacher);
    }
}
