import type { ClientSession } from 'mongoose'

import { RefreshTokenController } from '@/application/controllers/auth'
import { TokenManager } from '@/data/protocols/token'
import { TokenMongoRepository } from '@/infra/db/mongodb/repos'
import { JwtTokenEncryption } from '@/infra/encryption'

import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeRefreshTokenController = (
  session?: ClientSession
): RefreshTokenController => {
  const mongoSession = mongoSessionFactory(session)
  const tokenRepository = new TokenMongoRepository(session)
  const jwtManager = new JwtTokenEncryption(tokenRepository)
  const tokenManager = new TokenManager(tokenRepository, jwtManager)

  return new RefreshTokenController(tokenManager, mongoSession)
}
