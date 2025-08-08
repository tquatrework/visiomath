import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {CreateTeacherInvoiceUserRepository} from "./createTeacherInvoice.user.repository";
import {User} from "../../../shared/entities/user.entity";

@Injectable()
export class CreateTeacherInvoiceUserTypeOrmRepository implements CreateTeacherInvoiceUserRepository {
    private userRepository: Repository<User>;

    constructor(private dataSource: DataSource) {
        this.userRepository = this.dataSource.getRepository(User);
    }

    async findUserById(userId: number): Promise<User | null> {
        return this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.userProfile', 'userProfile')
            .leftJoinAndSelect('userProfile.teacherProfile', 'teacherProfile')
            .andWhere('user.id = :userId', { userId })
            .getOne();
    }
}