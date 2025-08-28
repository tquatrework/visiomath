import {Injectable} from "@nestjs/common";
import {DataSource, Repository} from "typeorm";
import {{UserStory2}Repository} from "./{userStory2}.repository";
import {User} from "../../../shared/entities/user.entity";

@Injectable()
export class {UserStory2}UserTypeOrmRepository implements {UserStory2}Repository {
    private userRepository: Repository<User>;

    constructor(private dataSource: DataSource) {
        this.userRepository = this.dataSource.getRepository(User);
    }

    async findById(id: number): Promise<User | null> {
        return await this.userRepository.findOne({
            where: { id },
            relations: ['userProfile']
        });
    }

    async save(user: User): Promise<User> {
        return await this.userRepository.save(user);
    }
}
