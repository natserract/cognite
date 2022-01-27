import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

export const usersCustom = async () => {
  return new Promise((resolve) => {
    resolve({
      message: 'Success'
    })
  })
}

type CreateUserField = {
  email: string,
  name: string,
  familyName?: string,
  phoneNumber: string,
  password: string,
  lastName?: string,
  tenantId?: string,
}

type CreateUserInput = {
  input: CreateUserField
}

export const createUser = ({ input }: CreateUserInput) => {
  // TODO: implement
}

type VerifyUserField = {
  code: string,
  username: string
}

type VerifyUserInput = {
  input: VerifyUserField
}
export const verifyUser = ({ input }: VerifyUserInput) => {
  // TODO: implement
}
