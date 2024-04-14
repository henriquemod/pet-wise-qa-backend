import { LoginController } from '@/application/controllers/auth'
import { ValidationComposite } from '@/application/validation'
import type { User, Token, Hash } from '@/data/usecases/'
import type { User as UserModel } from '@/domain/models'

jest.mock('@/application/validation/composite')

class UserGetStub implements User.Get {
  async getUser(
    value: string,
    origin?: User.Origin | undefined
  ): Promise<UserModel> {
    return await Promise.resolve({
      id: 'any_id',
      email: 'any_email',
      username: 'any_username',
      password: 'any_password'
    })
  }
}

class TokenSignInStub implements Token.SignIn {
  async signIn(user: UserModel): Promise<Token.SignResult> {
    return await Promise.resolve({
      userId: 'any_id',
      accessToken: 'any_access',
      refreshAccessToken: 'any_refresh'
    })
  }
}

class HashCompareStub implements Hash.Compare {
  async compare(value: string, hash: string): Promise<boolean> {
    return await Promise.resolve(true)
  }
}

interface SutTypes {
  sut: LoginController
  userManager: User.Get
  tokenManager: Token.SignIn
  hashManager: Hash.Compare
}

const makeSut = (): SutTypes => {
  const userManager = new UserGetStub()
  const tokenManager = new TokenSignInStub()
  const hashManager = new HashCompareStub()

  return {
    sut: new LoginController(userManager, tokenManager, hashManager),
    userManager,
    tokenManager,
    hashManager
  }
}

describe('Login Controller', () => {
  it('should return statusCode 200 on success', async () => {
    const { sut } = makeSut()
    const res = await sut.handle({
      username: 'any_username',
      password: 'any_password'
    })

    expect(res.statusCode).toBe(200)
  })

  it('should throw 401 if hash compare fails', async () => {
    const { sut, hashManager } = makeSut()

    jest.spyOn(hashManager, 'compare').mockResolvedValueOnce(false)

    const response = await sut.handle({
      username: 'any_username',
      password: 'any_password'
    })

    expect(response).toEqual({
      statusCode: 401,
      error: 'Invalid credentials'
    })
  })

  it('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle({
      username: 'any_username'
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })
  })

  it('should return 400 if no username is provided', async () => {
    const { sut } = makeSut()
    const error = new Error('validation_error')
    const ValidationCompositeSpy = jest.fn().mockImplementationOnce(() => ({
      validate: jest.fn().mockReturnValueOnce(error)
    }))
    jest
      .mocked(ValidationComposite)
      .mockImplementationOnce(ValidationCompositeSpy)

    const httpResponse = await sut.handle({
      password: 'any_password'
    })

    expect(httpResponse).toEqual({
      statusCode: 400,
      error: error.message
    })
  })
})