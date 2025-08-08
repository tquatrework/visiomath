import { Injectable, Inject } from '@nestjs/common';
import { CreateTeacherInvoiceCommand } from './createTeacherInvoice.command';
import { CreateTeacherInvoiceRepository } from './createTeacherInvoice.repository';
import { CreateTeacherInvoiceTypeOrmRepository } from './createTeacherInvoice.typeOrmRepository';
import { TeacherInvoice } from './teacherInvoice.entity';
import { CreateTeacherInvoiceDateTimeProvider } from './createTeacherInvoice.dateTimeProvider';
import { CreateTeacherInvoiceDateTimeProviderImplementation } from './createTeacherInvoice.dateTimeProviderImplementation';
import { CreateTeacherInvoiceFileStorage } from "./createTeacherInvoice.fileStorage";
import { CreateTeacherInvoiceFileStorageImplementation } from "./createTeacherInvoice.fileStorageImplementation";
import { User } from "../../../shared/entities/user.entity";
import { PdfValidator } from "./createTeacherInvoice.pdfValidator";


@Injectable()
export class CreateTeacherInvoiceUsecase {
    constructor(
        @Inject(CreateTeacherInvoiceTypeOrmRepository)
        private readonly createTeacherInvoiceRepository: CreateTeacherInvoiceRepository,
        @Inject(CreateTeacherInvoiceDateTimeProviderImplementation)
        private readonly dateTimeProvider: CreateTeacherInvoiceDateTimeProvider,
        @Inject(CreateTeacherInvoiceFileStorageImplementation)
        private readonly fileStorage: CreateTeacherInvoiceFileStorage,
    ) {}

    async execute(command: CreateTeacherInvoiceCommand): Promise<void> {
        let user: User | null;

        if (command.teacherId instanceof User) {
            user = command.teacherId;
        } else {
            user = await this.createTeacherInvoiceRepository.findUserById(command.teacherId as number);
            
            if (!user) {
                throw new Error("Professeur non trouvé");
            }
        }

        if (!user.isTeacher()) {
            throw new Error("Vous ne pouvez pas créer de facture");
        }
        
        const pdfValidator = new PdfValidator();
        if (!pdfValidator.isPdf(command.pdfFileContent)) {
            throw new Error("Le fichier doit être un PDF");
        }

        const currentDate = this.dateTimeProvider.now();

        const fileName = this.generateInvoicePdfFileName(user, currentDate);

        await this.fileStorage.saveFile(
            fileName,
            command.pdfFileContent
        );

        const teacherInvoice = new TeacherInvoice(
            user,
            command.amount,
            fileName,
            currentDate
        );

        try {
            await this.createTeacherInvoiceRepository.save(teacherInvoice);
        } catch (error) {
            throw new Error("La facture n'a pas pu être créée");
        }
    }

    private generateInvoicePdfFileName(user: User, currentDate: Date) {
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
