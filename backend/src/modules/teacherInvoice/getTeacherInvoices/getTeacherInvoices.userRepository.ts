export interface UserWithRole {
  id: number;
  role: string;
}

export interface GetTeacherInvoicesUserRepository {
  findUserById(userId: number): Promise<UserWithRole | null>;
}