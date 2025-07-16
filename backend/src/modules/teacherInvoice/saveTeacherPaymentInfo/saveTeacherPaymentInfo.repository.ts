import {User} from "../../../shared/entities/user.entity";

export interface SaveTeacherPaymentInfoRepository {
    findUserByIdWithTeacherProfil(id: number): Promise<User | null>;
    save(user: User): Promise<User>;
}
