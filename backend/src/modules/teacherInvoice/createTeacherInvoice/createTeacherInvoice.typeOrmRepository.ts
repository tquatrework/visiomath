import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {CreateTeacherInvoiceRepository} from "./createTeacherInvoice.repository";
import {User} from "../../../shared/entities/user.entity";
import {TeacherInvoice} from "./teacherInvoice.entity";

@Injectable()
export class CreateTeacherInvoiceTypeOrmRepository implements CreateTeacherInvoiceRepository {
    private userRepository: Repository<User>;
    private teacherInvoiceRepository: Repository<TeacherInvoice>;

    constructor(private dataSource: DataSource) {
        this.userRepository = this.dataSource.getRepository(User);
        this.teacherInvoiceRepository = this.dataSource.getRepository(TeacherInvoice);
    }

    async findUserById(userId: number): Promise<User | null> {
        return this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.userProfile', 'userProfile')
            .leftJoinAndSelect('userProfile.teacherProfile', 'teacherProfile')
            .andWhere('user.id = :userId', { userId })
            .getOne();
    }

    async save(teacherInvoice: TeacherInvoice): Promise<void> {
        await this.teacherInvoiceRepository.save(teacherInvoice);
    }

    async findById(id: number): Promise<TeacherInvoice | null> {
        return this.teacherInvoiceRepository.findOne({
            where: { id },
            relations: ['teacher']
        });
    }
}
