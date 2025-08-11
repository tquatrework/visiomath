export interface RefuseTeacherInvoiceUserRepository {
    findById(userId: number): Promise<{ id: number; role: string } | null>;
}