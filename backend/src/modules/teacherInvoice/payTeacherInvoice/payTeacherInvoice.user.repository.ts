export interface PayTeacherInvoiceUserRepository {
    findById(userId: number): Promise<{ id: number; role: string } | null>;
}