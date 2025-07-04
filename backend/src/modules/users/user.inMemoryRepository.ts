import { TeacherProfile } from "../../shared/entities/teacherProfile.entity";
import {User} from "../../shared/entities/user.entity";
import {UserRepository} from "./user.repository";



export class UserInMemoryRepository implements UserRepository {
    private store = new Map<number, User>()

    seed(user: User) {
        this.store.set(user.id, user)
    }

    async findUserByIdWithTeacherProfil(id: number): Promise<User | null> {
        return this.store.get(id) ?? null;
    }

    async save(user: User): Promise<void> {
        this.store.set(user.id, user)
    }
}
