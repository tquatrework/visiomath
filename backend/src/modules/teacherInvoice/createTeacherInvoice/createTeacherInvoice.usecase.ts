import { Injectable, Inject } from '@nestjs/common';
import { CreateTeacherInvoiceCommand } from './createTeacherInvoice.command';
import { CreateTeacherInvoiceTeacherInvoiceRepository } from './createTeacherInvoice.teacherInvoice.repository';
import { CreateTeacherInvoiceUserRepository } from './createTeacherInvoice.user.repository';
import { CreateTeacherInvoiceTeacherInvoiceTypeOrmRepository } from './createTeacherInvoice.teacherInvoice.typeOrmRepository';
import { CreateTeacherInvoiceUserTypeOrmRepository } from './createTeacherInvoice.user.typeOrmRepository';
import { TeacherInvoice } from './teacherInvoice.entity';
import { CreateTeacherInvoiceDateTimeProvider } from './createTeacherInvoice.dateTimeProvider';
import { CreateTeacherInvoiceDateTimeProviderImplementation } from './createTeacherInvoice.dateTimeProviderImplementation';
import { CreateTeacherInvoiceFileStorage } from "./createTeacherInvoice.fileStorage";
import { CreateTeacherInvoiceFileStorageImplementation } from "./createTeacherInvoice.fileStorageImplementation";
import { PdfValidator } from "./createTeacherInvoice.pdfValidator";


@Injectable()
export class CreateTeacherInvoiceUsecase {
    constructor(
        @Inject(CreateTeacherInvoiceUserTypeOrmRepository)
        private readonly userRepository: CreateTeacherInvoiceUserRepository,
        @Inject(CreateTeacherInvoiceTeacherInvoiceTypeOrmRepository)
        private readonly teacherInvoiceRepository: CreateTeacherInvoiceTeacherInvoiceRepository,
        @Inject(CreateTeacherInvoiceDateTimeProviderImplementation)
        private readonly dateTimeProvider: CreateTeacherInvoiceDateTimeProvider,
        @Inject(CreateTeacherInvoiceFileStorageImplementation)
        private readonly fileStorage: CreateTeacherInvoiceFileStorage,
    ) {}

    async execute(command: CreateTeacherInvoiceCommand): Promise<void> {

        const user = await this.userRepository.findUserById(command.userId);
        
        if (!user) {
            throw new Error("Professeur non trouvé");
        }

        if (user.role !== 'teacher') {
            throw new Error("Vous ne pouvez pas créer de facture");
        }
        
        const pdfValidator = new PdfValidator();
        if (!pdfValidator.isPdf(command.pdfFileContent)) {
            throw new Error("Le fichier doit être un PDF");
        }

        const currentDate = this.dateTimeProvider.now();

        const fileName = this.generateInvoicePdfFileName(user, currentDate);

        let savedFilePath: string;
        try {
            savedFilePath = await this.fileStorage.saveFile(
                fileName,
                command.pdfFileContent
            );
        } catch (error) {
            throw new Error("La facture n'a pas pu être créée");
        }

        const teacherInvoice = new TeacherInvoice(
            user,
            command.amount,
            savedFilePath,
            currentDate,
            command.dueDate
        );

        try {
            await this.teacherInvoiceRepository.save(teacherInvoice);
        } catch (error) {
            throw new Error("La facture n'a pas pu être créée");
        }
    }

    private generateInvoicePdfFileName(user: { pseudo: string }, currentDate: Date) {
        const teacherName = user.pseudo
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[^a-z0-9]/g, '');

        const year = currentDate.getUTCFullYear();
        const month = String(currentDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getUTCDate()).padStart(2, '0');
        const hours = String(currentDate.getUTCHours()).padStart(2, '0');
        const minutes = String(currentDate.getUTCMinutes()).padStart(2, '0');
        const seconds = String(currentDate.getUTCSeconds()).padStart(2, '0');

        const dateStr = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;

        const fileName = `invoice-${teacherName}-${dateStr}.pdf`;
        return fileName;
    }
}
