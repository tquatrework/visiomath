import { CreateTeacherInvoiceUserRepository } from '../createTeacherInvoice.user.repository';
import {User} from "../../../../shared/entities/user.entity";

export class CreateTeacherInvoiceUserSuccessInMemoryRepository implements CreateTeacherInvoiceUserRepository {
  private users: User[] = [];

  seed(user: User): void {
    this.users.push(user);
  }

  async findUserById(userId: number): Promise<User | null> {
    return this.users.find(user => user.id === userId) || null;
  }
}

export class CreateTeacherInvoiceUserNotFoundInMemoryRepository implements CreateTeacherInvoiceUserRepository {
  async findUserById(userId: number): Promise<User | null> {
    return null;
  }
}