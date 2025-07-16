import {{UserStory2}Repository} from "../{userStory2}.repository";
import {User} from "../../../../shared/entities/user.entity";

export class {UserStory2}InMemoryRepository implements {UserStory2}Repository {
    private users: Map<number, User> = new Map();

    async findById(id: number): Promise<User | null> {
        return this.users.get(id) || null;
    }

    async save(user: User): Promise<User> {
        this.users.set(user.id, user);
        return user;
    }

    seed(user: User): void {
        this.users.set(user.id, user);
    }
}
