import {GetTeacherPaymentInfoUserRepository, UserWithRole} from "../getTeacherPaymentInfo.user.repository";

export class GetTeacherPaymentInfoUserSuccessInMemoryRepository implements GetTeacherPaymentInfoUserRepository {
    private users: UserWithRole[] = [];

    async findUserById(id: number): Promise<UserWithRole | null> {
        return this.users.find(user => user.id === id) || null;
    }

    seed(user: UserWithRole): void {
        this.users.push(user);
    }
}

export class GetTeacherPaymentInfoUserNotFoundInMemoryRepository implements GetTeacherPaymentInfoUserRepository {
    async findUserById(id: number): Promise<UserWithRole | null> {
        return null;
    }
}