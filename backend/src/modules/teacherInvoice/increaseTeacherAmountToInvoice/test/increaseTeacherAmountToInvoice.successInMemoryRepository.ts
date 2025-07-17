import {IncreaseTeacherAmountToInvoiceRepository} from "../increaseTeacherAmountToInvoice.repository";
import {User} from "../../../../shared/entities/user.entity";

export class IncreaseTeacherAmountToInvoiceSuccessInMemoryRepository implements IncreaseTeacherAmountToInvoiceRepository {
    private users: Map<number, User> = new Map();

    async findUserByIdWithTeacherProfil(id: number): Promise<User | null> {
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
