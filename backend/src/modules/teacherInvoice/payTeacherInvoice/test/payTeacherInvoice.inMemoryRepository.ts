import {User} from "../../../../shared/entities/user.entity";
import {PayTeacherInvoiceRepository} from "../payTeacherInvoice.repository";

export class PayTeacherInvoiceInMemoryRepository implements PayTeacherInvoiceRepository {
    private users: User[] = [];

    seed(user: User): void {
        this.users.push(user);
    }

    async findUserByIdWithTeacherProfil(userId: number): Promise<User | null> {
        return this.users.find(user => user.id === userId) || null;
    }

    async findUserById(userId: number): Promise<User | null> {
        return this.users.find(user => user.id === userId) || null;
    }

    async save(user: User): Promise<void> {
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
            this.users[index] = user;
        }
    }
}
