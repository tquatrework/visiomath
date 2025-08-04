export interface ValidateTeacherInvoiceUserRepository {
    findUserById(userId: number): Promise<{ id: number; role: string } | null>;
}