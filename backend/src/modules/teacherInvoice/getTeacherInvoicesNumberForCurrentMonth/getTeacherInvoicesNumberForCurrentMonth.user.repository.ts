export interface UserWithRole {
  id: number;
  role: string;
}

export interface GetTeacherInvoicesNumberForCurrentMonthUserRepository {
  findUserById(userId: number): Promise<UserWithRole | null>;
}