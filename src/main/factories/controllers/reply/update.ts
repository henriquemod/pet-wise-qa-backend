import { UpdateReplyController } from '@/application/controllers/reply'
import { ReplyManager } from '@/data/protocols'
import {
  PostMongoRepository,
  ReplyMongoRepository,
  UserMongoRepository
} from '@/infra/db/mongodb/repos'
import { BCryptHash } from '@/infra/encryption'
import type { ClientSession } from 'mongoose'
import { mongoSessionFactory } from '../../sessions/mongo-session'

export const makeUpdateReplyController = (
  session?: ClientSession
): UpdateReplyController => {
  const mongoSession = mongoSessionFactory(session)
  const userRepository = new UserMongoRepository(new BCryptHash(), session)
  const replyRepository = new ReplyMongoRepository(session)
  const postRepository = new PostMongoRepository(session)
  const replyManager = new ReplyManager(
    replyRepository,
    postRepository,
    userRepository
  )

  return new UpdateReplyController(replyManager, mongoSession)
}
