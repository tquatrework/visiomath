import {
    CreateTeacherInvoiceRepository
} from "@src/features/teacherInvoice/createTeacherInvoice/createTeacherInvoice.repository";
import {
    CreateTeacherInvoiceCommand
} from "@src/features/teacherInvoice/createTeacherInvoice/createTeacherInvoice.command";
import apiSec from "@src/utils/tokenapi.utils";
import {AxiosError} from "axios";

export class CreateTeacherInvoiceFetchRepository implements CreateTeacherInvoiceRepository {
    async execute(createTeacherInvoiceCommand: CreateTeacherInvoiceCommand): Promise<void> {
        try {
            const formData = new FormData();
            formData.append('amount', createTeacherInvoiceCommand.amount.toString());
            formData.append('pdfFile', createTeacherInvoiceCommand.pdfFile);
            formData.append('dueDate', createTeacherInvoiceCommand.dueDate);
            
            await apiSec.post('/create-teacher-invoice', formData);
            
        } catch (error) {
            if (error instanceof AxiosError) {
                const message =
                    typeof error.response?.data?.message === 'string'
                        ? error.response.data.message
                        : 'Impossible d\'envoyer la facture.';
                throw new Error(message);
            }
            throw new Error('Impossible d\'envoyer la facture.');
        }
    }
}
