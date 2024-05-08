/* eslint-disable @typescript-eslint/ban-types */
import { JwtTokenEncryption } from '@/infra/encryption'
import { UserRepositoryStub } from '../stubs'
import '@/main/config/env'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken')
jest.mock('@/main/config/env', () => ({
  env: {
    jwtSecret: 'any_token_secret',
    refreshTokenSecret: 'any_refresh_token_secret'
  }
}))

interface SutTypes {
  sut: JwtTokenEncryption
  userRepositoryStub: UserRepositoryStub
}

const makeSut = (): SutTypes => {
  const userRepositoryStub = new UserRepositoryStub()
  const sut = new JwtTokenEncryption(userRepositoryStub)

  return {
    sut,
    userRepositoryStub
  }
}

describe('JWTEncryption - Validate', () => {
  afterAll(() => {
    jest.clearAllMocks()
  })

  it('should return true if token is valid', async () => {
    const { sut } = makeSut()

    jest.spyOn(jwt, 'verify').mockImplementationOnce((token, secret, cb) => {
      if (cb) {
        ;(cb as Function)(null)
      }
    })

    const res = await sut.validate('any_access_token')

    expect(res).toBe(true)
  })

  it('should return false if token is invalid', async () => {
    const { sut } = makeSut()

    jest.spyOn(jwt, 'verify').mockImplementationOnce((token, secret, cb) => {
      if (cb) {
        ;(cb as Function)('error')
      }
    })

    const res = await sut.validate('invalid_access_token')

    expect(res).toBe(false)
  })

  it('should call jwt with correct values', async () => {
    const { sut } = makeSut()

    const verifySpy = jest
      .spyOn(jwt, 'verify')
      .mockImplementationOnce((token, secret, cb) => {
        if (cb) {
          ;(cb as Function)(null)
        }
      })

    await sut.validate('any_access_token')

    expect(verifySpy).toHaveBeenCalledWith(
      'any_access_token',
      'any_token_secret',
      expect.any(Function)
    )
  })

  it('should throw if jwt throws', async () => {
    const { sut } = makeSut()

    jest.spyOn(jwt, 'verify').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.validate('any_access_token')

    await expect(promise).rejects.toThrow()
  })
})
