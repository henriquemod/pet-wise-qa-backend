import { Controller, ok } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Post } from '@/data/usecases'

import { type Validator, ValidationBuilder as builder } from '../../validation'

type PostManager = Post.FindPost

export class FindPostController extends Controller {
  constructor(private readonly postManager: PostManager) {
    super()
  }

  async perform({
    id
  }: Post.FindParams): Promise<HttpResponse<Post.FindResult>> {
    const post = await this.postManager.findPost({ id })

    return ok(post)
  }

  override buildValidators({ id }: Post.FindParams): Validator[] {
    return [
      ...builder
        .of({
          value: id,
          fieldName: 'id'
        })
        .required()
        .build()
    ]
  }
}
