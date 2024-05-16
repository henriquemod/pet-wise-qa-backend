import { RegisterController } from '@/application/controllers/auth'
import type { User } from '@/data/usecases/'
import { ActivationStub, MailServiceStub, UserStub } from '../../helpers'

interface SutTypes {
  sut: RegisterController
  userManager: User.Register
}

const makeSut = (): SutTypes => {
  const userManager = new UserStub()
  const mailService = new MailServiceStub()
  const activationStub = new ActivationStub()

  return {
    sut: new RegisterController(userManager, activationStub, mailService),
    userManager
  }
}

describe('Register Controller', () => {
  it('should return statusCode 200 on success', async () => {
    const { sut } = makeSut()

    const res = await sut.handle({
      email: 'any_email',
      username: 'any_username',
      password: 'any_password'
    })

    expect(res).toEqual({
      statusCode: 200,
      data: { id: 'any_id' }
    })
  })

  it('should return statusCode 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const res = await sut.handle({
      email: 'any_email',
      username: 'any_username'
    })

    expect(res).toEqual({
      statusCode: 400,
      error: 'The field password is required'
    })
  })

  it('should return statusCode 400 if no email is provided', async () => {
    const { sut } = makeSut()

    const res = await sut.handle({
      username: 'any_username',
      password: 'any_password'
    })

    expect(res).toEqual({
      statusCode: 400,
      error: 'The field email is required'
    })
  })

  it('should return statusCode 400 if no username is provided', async () => {
    const { sut } = makeSut()

    const res = await sut.handle({
      email: 'any_email',
      password: 'any_password'
    })

    expect(res).toEqual({
      statusCode: 400,
      error: 'The field username is required'
    })
  })

  it('should return statusCode 500 if user manager throws', async () => {
    const { sut, userManager } = makeSut()

    jest.spyOn(userManager, 'registerUser').mockRejectedValueOnce(new Error())

    const res = await sut.handle({
      email: 'any_email',
      username: 'any_username',
      password: 'any_password'
    })

    expect(res.statusCode).toBe(500)
  })
})
