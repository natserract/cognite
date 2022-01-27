import type { APIGatewayEvent, Context } from 'aws-lambda'
import { logger } from 'src/lib/logger'

import { confirmRegistration, getUser, isAuthenticated, listUser, loginCognito, logoutCognito, registerCognito, updateUser } from 'src/lib/cognito'

/**
 * The handler function is your code that processes http request events.
 * You can use return and throw to send a response or error, respectively.
 *
 * Important: When deployed, a custom serverless function is an open API endpoint and
 * is your responsibility to secure appropriately.
 *
 * @see {@link https://redwoodjs.com/docs/serverless-functions#security-considerations|Serverless Function Considerations}
 * in the RedwoodJS documentation for more information.
 *
 * @typedef { import('aws-lambda').APIGatewayEvent } APIGatewayEvent
 * @typedef { import('aws-lambda').Context } Context
 * @param { APIGatewayEvent } event - an object which contains information from the invoker.
 * @param { Context } context - contains information about the invocation,
 * function, and execution environment.
 */

type AuthorizationBody = {
  username: string;
  password: string;
}

export const handler = async (event: APIGatewayEvent, context: Context) => {
  logger.info('Invoked authorization function')

  const { username, password } = JSON.parse(event.body) as AuthorizationBody
  const logInResponses = await loginCognito({
    username,
    password,
  })

  const isAuthenticate = await isAuthenticated();
  console.log('isAuthenticate', isAuthenticate)

  const user = await getUser({
    username,
  });
  console.log('user responses', user);

  const listUserRes = await listUser({
    search: ''
  })
  console.log('listUserRes', listUserRes)

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: logInResponses,
    }),
  }
}
