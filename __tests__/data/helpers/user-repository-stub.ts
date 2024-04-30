import type { UserModel } from '@/domain/models'
import type { DBUser } from '@/domain/usecases/db'

export type DBUserStub = DBUser.Find & DBUser.Add

export const MOCK_USER = {
  id: 'any_id',
  email: 'any_email',
  username: 'any_username',
  password: 'any_password'
}

export class UserRepositoryStub implements DBUserStub {
  async findByEmail(email: string): Promise<UserModel | null> {
    return await Promise.resolve(MOCK_USER)
  }

  async findByUsername(username: string): Promise<UserModel | null> {
    return await Promise.resolve(MOCK_USER)
  }

  async findByUserId(userId: string): Promise<UserModel | null> {
    return await Promise.resolve(MOCK_USER)
  }

  async add(user: Omit<UserModel, 'id'>): Promise<DBUser.AddResult> {
    return await Promise.resolve({ id: MOCK_USER.id })
  }
}
