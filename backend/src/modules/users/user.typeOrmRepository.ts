import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User} from "../../shared/entities/user.entity";
import {UserRepository} from "./user.repository";

export class UserTypeOrmRepository implements UserRepository {

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async findUserByIdWithTeacherProfil(id: number): Promise<User | null> {
        return this.userRepository.findOne({
            where: { id },
            relations: ['teacherProfile'],
        });
    }

    async save(user: User): Promise<void> {
        await this.userRepository.save(user);
    }
}