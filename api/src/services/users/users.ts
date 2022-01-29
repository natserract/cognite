import {
  adminDeleteUser,
  confirmRegistration,
  getToken,
  getAdminUser,
  getUserSession,
  listUser,
  registerCognito,
  updateUser,
  UserPayloads,
  getUser
} from 'src/lib/cognito'

type ListUserCognitoInput = {
  search: string;
}

export const listUserCognito = async ({ search }: ListUserCognitoInput) => {
  const results = await listUser({ search })
  return results
}

type GetUserCognitoInput = {
  token: string;
}
export const getUserCognito = async ({ token }: GetUserCognitoInput) => {
  const userCognito = await getUser(token);
  const results = await getAdminUser({
    username: userCognito.UserAttributes.email
  })

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
export const verifyUserCognito = async ({ input }: VerifyUserInput) => {
  const {code, username} = input

  const results = await confirmRegistration({
    code,
    username
  })

  return results
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

type GetSessionInput = {
  token: string;
}

export const getSession = async ({ token }: GetSessionInput) => {
  return await getUser(token);
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

    const results = await getAdminUser({
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
