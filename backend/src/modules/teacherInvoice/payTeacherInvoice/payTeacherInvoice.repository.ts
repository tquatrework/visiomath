import {User} from "../../../shared/entities/user.entity";

export interface PayTeacherInvoiceRepository {
    findUserByIdWithTeacherProfil(userId: number): Promise<User | null>;
    findUserById(userId: number): Promise<User | null>;
    save(user: User): Promise<void>;
}
