import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {IncreaseTeacherAmountToInvoiceRepository} from "./increaseTeacherAmountToInvoice.repository";
import {User} from "../../../shared/entities/user.entity";

@Injectable()
export class IncreaseTeacherAmountToInvoiceTypeOrmRepository implements IncreaseTeacherAmountToInvoiceRepository {
    private userRepository: Repository<User>;

    constructor(private dataSource: DataSource) {
        this.userRepository = this.dataSource.getRepository(User);
    }

    async findUserByIdWithTeacherProfil(id: number): Promise<User | null> {
        return this.userRepository.createQueryBuilder('user')
            .leftJoinAndSelect('user.userProfile', 'userProfile')
            .leftJoinAndSelect('userProfile.teacherProfile', 'teacherProfile')

            .andWhere('user.id = :id', { id })
            .getOne();
    }

    async save(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
}
