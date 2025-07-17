import {User} from "../../../shared/entities/user.entity";

export interface IncreaseTeacherAmountToInvoiceRepository {
    findUserByIdWithTeacherProfil(id: number): Promise<User | null>;
    save(user: User): Promise<User>;
}
