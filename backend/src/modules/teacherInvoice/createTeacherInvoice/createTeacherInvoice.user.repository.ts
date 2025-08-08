import {User} from "../../../shared/entities/user.entity";

export interface CreateTeacherInvoiceUserRepository {
  findUserById(userId: number): Promise<User | null>;
}