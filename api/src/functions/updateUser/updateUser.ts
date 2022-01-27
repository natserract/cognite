import type { APIGatewayEvent, Context } from 'aws-lambda'
import { getUserSession, getToken, updateUser, UserPayloads, getUser } from 'src/lib/cognito'
import { logger } from 'src/lib/logger'

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

type UpdateUserInput = {
  userAttributes: UserPayloads
};

export const handler = async (event: APIGatewayEvent, context: Context) => {
  logger.info('Invoked updateUser function')

  const { userAttributes } = JSON.parse(event.body) as UpdateUserInput

  async function updateUserCognito() {
    const token = await getToken()
    const results = await updateUser({
      token,
      userAttributes,
    })

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

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: userSessions,
    }),
  }
}
