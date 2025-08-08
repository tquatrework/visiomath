import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {CreateTeacherInvoiceTeacherInvoiceRepository} from "./createTeacherInvoice.teacherInvoice.repository";
import {TeacherInvoice} from "./teacherInvoice.entity";

@Injectable()
export class CreateTeacherInvoiceTeacherInvoiceTypeOrmRepository implements CreateTeacherInvoiceTeacherInvoiceRepository {
    private teacherInvoiceRepository: Repository<TeacherInvoice>;

    constructor(private dataSource: DataSource) {
        this.teacherInvoiceRepository = this.dataSource.getRepository(TeacherInvoice);
    }

    async save(teacherInvoice: TeacherInvoice): Promise<void> {
        await this.teacherInvoiceRepository.save(teacherInvoice);
    }
}