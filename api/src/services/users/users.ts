import { getUser, listUser } from 'src/lib/cognito'

type ListUserCognitoInput = {
  search: string;
}

export const listUserCognito = async ({ search }: ListUserCognitoInput) => {
  const results = await listUser({ search })
  return results
}

type GetUserCognitoInput = {
  username: string;
}
export const getUserCognito = async ({ username }: GetUserCognitoInput) => {
  const results = await getUser({ username })
  return results
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

export const deleteUserCognito = ({ input }) => {
  // TODO: implement
}
