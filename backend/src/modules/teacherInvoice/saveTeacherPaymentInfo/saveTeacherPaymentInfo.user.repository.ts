export interface SaveTeacherPaymentInfoUserRepository {
    findUserById(userId: number): Promise<{ id: number; role: string } | null>;
}