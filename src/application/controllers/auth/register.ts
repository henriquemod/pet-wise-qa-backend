import { Controller, ok } from '@/application/protocols'
import type { HttpResponse } from '@/application/protocols/http/responses'
import type { Authentication, Mail, User } from '@/data/usecases'
import { ValidationBuilder as builder, type Validator } from '../../validation'

type UserManager = User.Register
type MailService = Mail.SendActivationMail

export class RegisterController extends Controller {
  constructor(
    private readonly userManager: UserManager,
    private readonly mailService: MailService
  ) {
    super()
  }

  async perform({
    username,
    password,
    email
  }: Authentication.RegisterParams): Promise<
    HttpResponse<Authentication.RegisterResult>
  > {
    const { id } = await this.userManager.registerUser({
      username,
      password,
      email
    })

    await this.mailService.sendActivationMail(email)

    return ok({
      id
    })
  }

  override buildValidators({
    password,
    username,
    email
  }: Authentication.RegisterParams): Validator[] {
    return [
      ...builder
        .of({
          value: password,
          fieldName: 'password'
        })
        .required()
        .build(),
      ...builder
        .of({
          value: username,
          fieldName: 'username'
        })
        .required()
        .build(),
      ...builder
        .of({
          value: email,
          fieldName: 'email'
        })
        .required()
        .build()
    ]
  }
}
