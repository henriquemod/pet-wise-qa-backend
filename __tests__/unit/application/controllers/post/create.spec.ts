import { omit } from 'ramda'

import { CreatePostController } from '@/application/controllers/post'
import { ValidationComposite } from '@/application/validation'
import { type AI, type Post, Queue } from '@/data/usecases/'

import { AiStub, MOCK_POST, PostStub, QueueStub } from '../../helpers'

jest.mock('@/application/validation/composite')

interface SutTypes {
  sut: CreatePostController
  postManager: Post.CreatePost
  aiManager: AI.ValidateContent
  queue: Queue.Add
}

interface SutParams {
  queue?: boolean
}

const makeSut = (params?: SutParams): SutTypes => {
  const postManager = new PostStub()
  const aiManager = new AiStub()
  const queue = new QueueStub()

  return {
    sut: new CreatePostController({
      postManager,
      AIManager: aiManager,
      queue: params?.queue ? queue : undefined
    }),
    postManager,
    aiManager,
    queue
  }
}

const MOCK_BODY = {
  title: 'any_title',
  content: 'any_content',
  userId: 'any_user_id'
}

describe('Create Post Controller', () => {
  it('should return statusCode 200 on success', async () => {
    const { sut } = makeSut()
    const res = await sut.handle(MOCK_BODY)

    expect(res).toMatchObject({
      statusCode: 200,
      data: {
        id: 'any_id'
      }
    })
  })

  it('should return statusCode 500 if createPost throws', async () => {
    const { sut, postManager } = makeSut()

    jest.spyOn(postManager, 'createPost').mockRejectedValueOnce(new Error())

    const res = await sut.handle(MOCK_BODY)

    expect(res.statusCode).toBe(500)
  })

  it('should return 400 if no title is provided', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle(omit(['title'], MOCK_BODY))

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })
  })

  it('should return 400 if no content is provided', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle(omit(['content'], MOCK_BODY))

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })
  })

  it('should return 400 if no userId is provided', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle(omit(['userId'], MOCK_BODY))

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })
  })

  it('should return 400 if content fails on AI validation', async () => {
    const { sut, aiManager } = makeSut()

    jest.spyOn(aiManager, 'validateContent').mockResolvedValueOnce(false)

    const httpResponse = await sut.handle(MOCK_BODY)

    expect(httpResponse).toEqual({
      statusCode: 400,
      error:
        'Your post contains inappropriate content. Please review it and try again.'
    })
  })

  it('should call queue.add with correct values', async () => {
    const { sut, queue } = makeSut({
      queue: true
    })

    const addSpy = jest.spyOn(queue, 'add')

    await sut.handle(MOCK_BODY)

    expect(addSpy).toHaveBeenCalledWith({
      taskName: 'reply-to-post',
      queueName: Queue.Name.REPLY_TO_POST,
      content: MOCK_POST
    })
  })
})
