import { SaveTeacherPaymentInfoTeacherPaymentInfoRepository } from "../saveTeacherPaymentInfo.teacherPaymentInfo.repository";
import { User } from "../../../../shared/entities/user.entity";
import { UserProfile } from "../../../../shared/entities/userprofile.entity";
import { TeacherProfile } from "../../../../shared/entities/teacherProfile.entity";

export class SaveTeacherPaymentInfoTeacherPaymentInfoSuccessInMemoryRepository implements SaveTeacherPaymentInfoTeacherPaymentInfoRepository {
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

export class SaveTeacherPaymentInfoTeacherPaymentInfoNotFoundInMemoryRepository implements SaveTeacherPaymentInfoTeacherPaymentInfoRepository {
    async findUserByIdWithTeacherProfil(id: number): Promise<User | null> {
        return null;
    }

    async save(user: User): Promise<User> {
        return user;
    }
}

export class SaveTeacherPaymentInfoTeacherPaymentInfoFailureInMemoryRepository implements SaveTeacherPaymentInfoTeacherPaymentInfoRepository {
    private users: Map<number, User> = new Map();

    async findUserByIdWithTeacherProfil(id: number): Promise<User | null> {
        return this.users.get(id) || null;
    }

    async save(user: User): Promise<User> {
        throw new Error("Erreur lors de l'enregistrement des informations de paiement du professeur.");
    }

    seed(user: User): void {
        this.users.set(user.id, user);
    }
}