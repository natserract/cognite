import { CognitoUserPool, CognitoUser, CognitoUserAttribute, AuthenticationDetails, CognitoUserSession, CognitoAccessToken } from 'amazon-cognito-identity-js';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider'
import AWS from 'aws-sdk'
import owasp from 'owasp-password-strength-test';
import { parseUserAttributes } from './utils';
import { ASTCognitoUser } from './types';

global.fetch = require('node-fetch');

AWS.config.credentials = new AWS.CognitoIdentityCredentials({
  IdentityPoolId: `${process.env.AWS_POOL_IDENTITY_POOL}`,
})

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
})

const poolData = {
  UserPoolId: process.env.AWS_POOL_ID,
  ClientId: process.env.AWS_CLIENT_ID,
}

const client = new CognitoIdentityServiceProvider();

owasp.config({
  allowPassphrases: true,
  maxLength: 128,
  minLength: 8,
  minPhraseLength: 8,
  minOptionalTestsToPass: 4,
})

// Custom validation for have symbol char
owasp.tests.required.push((password) => {
  const regexSymbolChar = new RegExp("^(?=.*[.!@#\$%\^&\*])");

  if (!regexSymbolChar.test(password)) {
    return 'Password must have symbol characters'
  }
})

type AuthPayloads = {
  username: string;
  password: string;
}

type LoginUserReturn = {
  username: string;
  name: string;
  email: string;
  token: string;
}

const userPool = new CognitoUserPool(poolData);

export const loginCognito = async (payloads: AuthPayloads) => {
  console.log('poolData', poolData)

  const { username, password } = payloads
  const authenticationDetails = new AuthenticationDetails(
    {
      Username: username,
      Password: password,
    }
  );

  const userData = {
    Username: username,
    Pool: userPool,
  }
  const cognitoUser = new CognitoUser(userData)

  // { USER_SRP_AUTH } will take in USERNAME and SRP_A and return
  // the SRP variables to be used for next challenge execution
  // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CognitoIdentityServiceProvider.html#confirmSignUp-property
  // @default: cognitoUser.setAuthenticationFlowType('USER_SRP_AUTH');
  cognitoUser.setAuthenticationFlowType('USER_PASSWORD_AUTH');

  const token = await new Promise((resolve) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: result => {

        // User authentication was successful
        const jwtToken = result.getAccessToken().getJwtToken()
        const payload = result.getIdToken()
        const { sub, name, email } = payload.payload

        if (jwtToken) {
          resolve(result)
        }
      },
      onFailure: error => {
        // User authentication was not successful
        // console.log('ERROR', error)
        resolve({ error: error.message })
      },
      newPasswordRequired(userAttributes) {
        delete userAttributes.email_verified
        cognitoUser.completeNewPasswordChallenge(
          password,
          userAttributes,
          this,
        )
      },
    })
  })

  return token
}

export type UserPayloads = {
  email: string,
  name: string,
  password: string,
  phone_number: string,
  family_name?: string,
  last_name?: string,
  tenant_id?: string,
}

export const registerCognito = async (payloads: UserPayloads) => {
  const { email, name, family_name, phone_number, password, last_name, tenant_id } = payloads

  const attributeList = []

  attributeList.push(
    new CognitoUserAttribute({
      Name: 'name',
      Value: name,
    }),
  )

  attributeList.push(
    new CognitoUserAttribute({
      Name: 'family_name',
      Value: family_name,
    }),
  )

  attributeList.push(
    new CognitoUserAttribute({
      Name: 'email',
      Value: email,
    }),
  )

  attributeList.push(
    new CognitoUserAttribute({
      Name: 'phone_number',
      Value: phone_number,
    }),
  )

  attributeList.push(
    new CognitoUserAttribute({
      Name: 'custom:scope',
      Value: last_name,
    }),
  )

  attributeList.push(
    new CognitoUserAttribute({
      Name: 'custom:tenant_id',
      Value: tenant_id,
    }),
  )

  return new Promise(async (resolve, reject) => {
    // Validate password
    const checkPassword = (await cognitoCheckPassword(password))
    const { strong, errors } = checkPassword
    const isValid = strong && !errors.length

    console.log('isValid', isValid)

    if (!isValid) {
      if (errors.length) reject(errors[0])
    }

    userPool.signUp(email, password, attributeList, null, (
      err,
      result
    ) => {
      if (err) {
        reject(err)
      }

      console.log('register result', result)
      resolve(result)
    })
  })
}

export const cognitoCheckPassword = async password => {
  return owasp.test(password)
}

type ConfirmRegistrationPayloads = {
  code: string,
  username: string
}

export const confirmRegistration = async (payloads: ConfirmRegistrationPayloads) => {
  const { code, username } = payloads

  const userData = {
    Username: username,
    Pool: userPool,
  }
  const cognitoUser = new CognitoUser(userData)

  return new Promise((resolve, reject) => {
    cognitoUser.confirmRegistration(code, true, (err, result) => {
      if (err) {
        reject(err)
      }

      resolve(result)
    })
  })
}

type UpdateUserPayloads = {
  token: string;
  userAttributes: Partial<UserPayloads>
}

export const updateUser = async (payloads: UpdateUserPayloads): Promise<Boolean | Error> => {
  const { token, userAttributes } = payloads
  const attributeList = []

  attributeList.push(
    new CognitoUserAttribute({
      Name: 'name',
      Value: userAttributes.name,
    }),
  )

  attributeList.push(
    new CognitoUserAttribute({
      Name: 'family_name',
      Value: userAttributes.family_name,
    }),
  )

  attributeList.push(
    new CognitoUserAttribute({
      Name: 'email',
      Value: userAttributes.email,
    }),
  )

  attributeList.push(
    new CognitoUserAttribute({
      Name: 'phone_number',
      Value: userAttributes.phone_number,
    }),
  )

  attributeList.push(
    new CognitoUserAttribute({
      Name: 'custom:scope',
      Value: userAttributes.last_name,
    }),
  )

  attributeList.push(
    new CognitoUserAttribute({
      Name: 'custom:tenant_id',
      Value: userAttributes.tenant_id,
    }),
  )

  const params = {
    UserAttributes: attributeList,
    AccessToken: token,
  }

  return new Promise((resolve, reject) => {
    client.updateUserAttributes(params, (
      err,
      result
    ) => {
      if (err) {
        reject(err)
      }

      resolve(true)
    })
  })
}

type LogoutPayloads = {
  token: string;
}

export const logoutCognito = async (payloads: LogoutPayloads): Promise<string> => {
  const { token } = payloads;

  const params = {
    AccessToken: token
  }

  return new Promise((resolve, reject) => {
    client.globalSignOut(params, (
      err,
      _data
    ) => {
      if (err) {
        reject(err)
      }

      resolve('Logout success!')
    })
  })
}

export const isAuthenticated = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const currentUser = userPool.getCurrentUser()

    if (!currentUser) resolve(false)
    resolve(true)
  })
}

type ListUserPayloads = {
  search?: string,
  filter?: string
}

export const listUser = async (payloads: ListUserPayloads) => {
  const { search, filter } = payloads

  let searchUser = ''
  const params = {
    UserPoolId: process.env.AWS_POOL_ID,
    Limit: 10,
  }

  if (search) searchUser = `given_name = "${search}"`

  return new Promise((resolve, reject) => {
    if (filter) {
      client.listUsersInGroup({
        ...params,
        GroupName: filter
      }, (
        err,
        result
      ) => {
        if (err) {
          reject(err)
        }
        resolve(result)
      })
    } else {
      client.listUsers({ ...params, Filter: searchUser }, (
        err,
        result,
      ) => {
        if (err) {
          reject(err)
        }

        result.Users.map((item) => {
          Object.entries(item).forEach(([key, val]) => {
            if (key === 'Attributes') {
              item.Attributes =
                parseUserAttributes(val, item.Attributes, key)['Attributes'] as any;
            }
          })

          return item
        })

        resolve(result)
      })
    }
  })
}

type GetAdminUserReturn = CognitoIdentityServiceProvider.AdminGetUserResponse

export const getAdminUser = async (payloads: Pick<AuthPayloads, 'username'>): Promise<GetAdminUserReturn> => {
  const { username } = payloads
  const params = {
    UserPoolId: process.env.AWS_POOL_ID,
    Username: username,
  }

  return new Promise((resolve, reject) => {
    client.adminGetUser(params, (
      err,
      result,
    ) => {
      if (err) reject(err)

      let mappingResult = {} as GetAdminUserReturn;
      Object.entries(result).forEach(([key, val]) => {
        if (key !== 'UserAttributes') {
          mappingResult[key] = val
        } else {
          // No pure, change `mappingResult`
          parseUserAttributes(val, mappingResult)
        }
      })

      resolve(mappingResult)
    })
  })
}

type GetUserReturn = ASTCognitoUser

export const getUser = async (token: string): Promise<GetUserReturn> => {
  const params = {
    AccessToken: token,
  }

  return new Promise((resolve, reject) => {
    client.getUser(params, (
      err,
      data
    ) => {
      if (err) {
        reject(err)
      }

      if (!data) resolve(data as unknown as ASTCognitoUser);
      else {
        let UserAttributes = parseUserAttributes(data.UserAttributes, {})
        data.UserAttributes = UserAttributes.UserAttributes as any;

        resolve(data as unknown as ASTCognitoUser)
      }
    });
  })

}

export const getUserSession = async (): Promise<CognitoUserSession> => {
  return new Promise((resolve, reject) => {
    const currentUser = userPool.getCurrentUser()

    if (!currentUser) resolve(null)

    currentUser.getSession((
      error: Error,
      session: CognitoUserSession
    ) => {
      if (error) {
        reject(error)
      }

      resolve(session);
    })
  })
}

export const getToken = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    const currentUser = userPool.getCurrentUser()

    if (!currentUser) resolve(null)

    currentUser.getSession((
      error: Error,
      session: CognitoUserSession
    ) => {
      if (error) {
        reject(error)
      }

      const accessToken = session.getAccessToken()
      resolve(accessToken.getJwtToken());
    })
  })
}

type AdminDeleteUserPayloads = {
  username: string;
}
export const adminDeleteUser = async (payloads: AdminDeleteUserPayloads) => {
  const { username } = payloads

  const params = {
    UserPoolId: process.env.AWS_POOL_ID,
    Username: username,
  }

  return new Promise(resolve => {
    client.adminDeleteUser(params, (err) => {
      if (err) resolve(false)
      else resolve(true)
    })
  })
}
