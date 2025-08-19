export interface GetCurrentTeacherInvoicesUserRepository {
    findUserById(userId: number): Promise<{ role: string } | null>;
}