export interface UserWithRole {
    id: number;
    role: string;
}

export interface GetTeacherPaymentInfoUserRepository {
    findUserById(id: number): Promise<UserWithRole | null>;
}