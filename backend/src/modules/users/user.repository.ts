import {User} from "../../shared/entities/user.entity";

export interface UserRepository {
    findUserByIdWithTeacherProfil(id: number): Promise<User | null>;

    save(user: User): Promise<void>;
}