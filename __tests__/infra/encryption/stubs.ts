import type { DBToken } from '@/domain/usecases/db/token'

type UserRepository = DBToken.Delete & DBToken.Find

export class UserRepositoryStub implements UserRepository {
  async delete(accessToken: string): Promise<void> {
    await Promise.resolve()
  }

  async findByToken(
    accessTokenToFind: string
  ): Promise<DBToken.FindResult | null> {
    return await Promise.resolve({
      accessToken: 'any_access_token',
      user: {
        id: 'any_id',
        email: 'any_email',
        username: 'any_username',
        password: 'any_password'
      }
    })
  }

  async findByRefreshToken(
    accessTokenToFind: string
  ): Promise<DBToken.FindResult | null> {
    return await Promise.resolve({
      accessToken: 'any_access_token',
      user: {
        id: 'any_id',
        email: 'any_email',
        username: 'any_username',
        password: 'any_password'
      }
    })
  }

  async findByUserId(userId: string): Promise<DBToken.FindResult | null> {
    return await Promise.resolve({
      accessToken: 'any_access_token',
      user: {
        id: 'any_id',
        email: 'any_email',
        username: 'any_username',
        password: 'any_password'
      }
    })
  }
}