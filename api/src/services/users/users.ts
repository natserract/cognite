import { adminDeleteUser, getToken, getUser, getUserSession, listUser, registerCognito, updateUser, UserPayloads } from 'src/lib/cognito'

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
  password: string,
  phone_number: string,
  family_name?: string,
  last_name?: string,
  tenant_id?: string,
}

type CreateUserInput = {
  input: CreateUserField
}

export const createUserCognito = async ({ input }: CreateUserInput) => {
  const results = await registerCognito({
    ...input
  })

  return results;
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

type DeleteUserCognitoInput = {
  username: string;
}
export const deleteUserCognito = async ({ username }: DeleteUserCognitoInput) => {
  const results = await adminDeleteUser({
    username,
  })

  return results
}

export const getSession = async () => {
  return await getUserSession();
}

type UpdateUserCognitoInput = {
  input: Partial<UserPayloads>
}
export const updateUserCognito = async ({ input }: UpdateUserCognitoInput) => {
  async function updateUserCognito() {
    const token = await getToken()
    const results = await updateUser({
      token,
      userAttributes: input,
    })

    console.log('Update results', results);

    return results
  }

  async function getUserSessionCognito() {
    const userSession = await getUserSession();
    const payload = userSession.getIdToken()
    const { email } = payload.payload

    const results = await getUser({
      username: email,
    })

    return results
  }

  let userSessions = {};
  const updateUserResponse = await updateUserCognito();

  if (updateUserResponse) {
    userSessions = await getUserSessionCognito();
  }

  return userSessions
}
