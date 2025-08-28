import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {GetTeacherPaymentInfoUserRepository, UserWithRole} from "./getTeacherPaymentInfo.user.repository";
import {User} from "../../../shared/entities/user.entity";

@Injectable()
export class GetTeacherPaymentInfoUserTypeOrmRepository implements GetTeacherPaymentInfoUserRepository {
    private userRepository: Repository<User>;

    constructor(private dataSource: DataSource) {
        this.userRepository = this.dataSource.getRepository(User);
    }

    async findUserById(id: number): Promise<UserWithRole | null> {
        const user = await this.userRepository.findOne({
            where: { id },
            select: ['id', 'role']
        });
        
        return user ? { id: user.id, role: user.role } : null;
    }
}