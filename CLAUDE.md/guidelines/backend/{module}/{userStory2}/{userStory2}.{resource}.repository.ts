import {User} from "../../../shared/entities/user.entity";

export interface {UserStory2}Repository {
    findById(id: number): Promise<User | null>;
    save(user: User): Promise<User>;
}
