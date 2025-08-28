import { User } from "../../../shared/entities/user.entity";

export interface SaveTeacherPaymentInfoTeacherPaymentInfoRepository {
    findUserByIdWithTeacherProfil(id: number): Promise<User | null>;
    save(user: User): Promise<User>;
}