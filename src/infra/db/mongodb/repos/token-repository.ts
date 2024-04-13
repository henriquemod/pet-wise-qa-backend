import type { AccessToken } from '@/domain/models'
import type { DBToken } from '@/domain/usecases/db/token'
import { AccessTokenSchema } from '@/infra/db/mongodb/schemas'
import mongoose from 'mongoose'

export class TokenMongoRepository
  implements DBToken.Add, DBToken.Find, DBToken.Delete
{
  async add({
    accessToken,
    refreshAccessToken,
    userId
  }: DBToken.AddParams): Promise<void> {
    const token = new AccessTokenSchema({
      accessToken,
      refreshAccessToken,
      user: new mongoose.Types.ObjectId(userId)
    })
    await token.save()
  }

  async findByToken(
    accessToken: AccessToken
  ): Promise<DBToken.FindResult | null> {
    return await AccessTokenSchema.findOne({
      accessToken
    }).populate('user')
  }

  async findByRefreshToken(
    refreshAccessToken: AccessToken
  ): Promise<DBToken.FindResult | null> {
    return await AccessTokenSchema.findOne({
      refreshAccessToken
    }).populate('user')
  }

  async findByUserId(userId: string): Promise<DBToken.FindResult | null> {
    const user = new mongoose.Types.ObjectId(userId)
    return await AccessTokenSchema.findOne({ user }).populate('user')
  }

  async delete(accessToken: string): Promise<undefined> {
    await AccessTokenSchema.deleteOne({ accessToken })
  }
}
