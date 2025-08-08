import { CreateTeacherInvoiceRepository } from "../createTeacherInvoice.repository";
import { TeacherInvoice } from "../teacherInvoice.entity";
import { User } from "../../../../shared/entities/user.entity";

export class CreateTeacherInvoiceFailureInMemoryRepository implements CreateTeacherInvoiceRepository {
    private users: User[] = [];
    private invoices: TeacherInvoice[] = [];

    seed(user: User): void {
        this.users.push(user);
    }

    seedInvoice(invoice: TeacherInvoice): void {
        this.invoices.push(invoice);
    }

    async findUserById(userId: number): Promise<User | null> {
        return this.users.find(user => user.id === userId) || null;
    }

    async save(teacherInvoice: TeacherInvoice): Promise<void> {
        throw new Error("database error");
    }


}
