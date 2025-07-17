import {IncreaseTeacherAmountToInvoiceRepository} from "../increaseTeacherAmountToInvoice.repository";
import {User} from "../../../../shared/entities/user.entity";

export class IncreaseTeacherAmountToInvoiceFailureInMemoryRepository implements IncreaseTeacherAmountToInvoiceRepository {
    private users: Map<number, User> = new Map();

    async findUserByIdWithTeacherProfil(id: number): Promise<User | null> {
        return this.users.get(id) || null;
    }

    async save(user: User): Promise<User> {
        throw new Error("Erreur de BDD xxxxxxx");
    }

    seed(user: User): void {
        this.users.set(user.id, user);
    }
}
