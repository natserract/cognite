import type { Prisma } from '@prisma/client'
import type { ResolverArgs } from '@redwoodjs/graphql-server'

export const listUserCognito = async () => {
  return new Promise((resolve) => {
    resolve({
      message: 'Success'
    })
  })
}

export const getUserCognito = () => {
  // TODO:
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

export const createUserCognito = ({ input }: CreateUserInput) => {
  // TODO: implement
}

type VerifyUserField = {
  code: string,
  username: string
}

type VerifyUserInput = {
  input: VerifyUserField
}
export const verifyUserCognito = ({ input }: VerifyUserInput) => {
  // TODO: implement
}

export const deleteUserCognito = ({input}) => {
  // TODO: implement
}
