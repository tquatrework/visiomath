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

    async hasInvoiceForCurrentMonth(teacherId: number, currentDate: Date): Promise<boolean> {
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);

        const invoiceCount = await this.teacherInvoiceRepository.createQueryBuilder('teacherInvoice')
            .where('teacherInvoice.teacherId = :teacherId', { teacherId })
            .andWhere('teacherInvoice.creationDate >= :startOfMonth', { startOfMonth })
            .andWhere('teacherInvoice.creationDate <= :endOfMonth', { endOfMonth })
            .getCount();

        return invoiceCount > 0;
    }
    
    // Méthode utilitaire pour charger une facture avec la relation teacher
    async findById(id: number): Promise<TeacherInvoice | null> {
        return this.teacherInvoiceRepository.findOne({
            where: { id },
            relations: ['teacher']
        });
    }
}
