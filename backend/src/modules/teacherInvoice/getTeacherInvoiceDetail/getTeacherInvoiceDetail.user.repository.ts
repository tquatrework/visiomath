export interface UserWithRole {
  id: number;
  role: string;
}

export interface GetTeacherInvoiceDetailUserRepository {
  findUserById(userId: number): Promise<UserWithRole | null>;
}