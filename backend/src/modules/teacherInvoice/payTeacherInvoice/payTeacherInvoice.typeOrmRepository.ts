import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {PayTeacherInvoiceRepository} from "./payTeacherInvoice.repository";
import {User} from "../../../shared/entities/user.entity";

@Injectable()
export class PayTeacherInvoiceTypeOrmRepository implements PayTeacherInvoiceRepository {
    private userRepository: Repository<User>;

    constructor(private dataSource: DataSource) {
        this.userRepository = this.dataSource.getRepository(User);
    }

    async findUserByIdWithTeacherProfil(userId: number): Promise<User | null> {
        return this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.userProfile', 'userProfile')
            .leftJoinAndSelect('userProfile.teacherProfile', 'teacherProfile')
            .andWhere('user.id = :userId', { userId })
            .getOne();
    }

    async findUserById(userId: number): Promise<User | null> {
        return this.userRepository.createQueryBuilder('user')
            .andWhere('user.id = :userId', { userId })
            .getOne();
    }

    async save(user: User): Promise<void> {
        await this.userRepository.save(user);
    }
}
