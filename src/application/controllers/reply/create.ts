import { Controller, noContent } from '@/application/protocols'
import type { AuthenticatedRequest } from '@/application/protocols/http/authenticated-request'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Reply } from '@/data/usecases'
import { ValidationBuilder as builder, type Validator } from '../../validation'

type PerformParams = AuthenticatedRequest<
  Omit<Reply.ReplyPostParams, 'authorId'>
>

export class CreateReplyController extends Controller {
  constructor(private readonly replyManager: Reply.ReplyPost) {
    super()
  }

  async perform({
    postId,
    userId: authorId,
    content
  }: PerformParams): Promise<HttpResponse<void>> {
    await this.replyManager.reply({
      postId,
      authorId,
      content
    })

    return noContent()
  }

  override buildValidators({
    postId,
    userId,
    content
  }: PerformParams): Validator[] {
    return [
      ...builder
        .of({
          value: userId,
          fieldName: 'userId'
        })
        .required()
        .build(),
      ...builder
        .of({
          value: postId,
          fieldName: 'postId'
        })
        .required()
        .build(),
      ...builder
        .of({
          value: content,
          fieldName: 'content'
        })
        .required()
        .build()
    ]
  }
}