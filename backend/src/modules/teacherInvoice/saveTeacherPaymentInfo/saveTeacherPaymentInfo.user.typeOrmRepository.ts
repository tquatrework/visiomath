import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {SaveTeacherPaymentInfoUserRepository} from "./saveTeacherPaymentInfo.user.repository";
import {User} from "../../../shared/entities/user.entity";

@Injectable()
export class SaveTeacherPaymentInfoUserTypeOrmRepository implements SaveTeacherPaymentInfoUserRepository {
    private userRepository: Repository<User>;

    constructor(private dataSource: DataSource) {
        this.userRepository = this.dataSource.getRepository(User);
    }

    async findUserById(userId: number): Promise<{ id: number; role: string } | null> {
        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ['id', 'role']
        });
        
        return user ? { id: user.id, role: user.role } : null;
    }
}