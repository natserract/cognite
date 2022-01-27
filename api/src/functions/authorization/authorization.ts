import type { APIGatewayEvent, Context } from 'aws-lambda'
import { logger } from 'src/lib/logger'

import { confirmRegistration, loginCognito, registerCognito, updateUser } from 'src/lib/cognito'

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
export const handler = async (event: APIGatewayEvent, context: Context) => {
  logger.info('Invoked authorization function')

  // const registerResponses = registerCognito({
  //   email: 'aveqhfj193@tormails.com',
  //   familyName: 'Surya',
  //   name: 'Alfin Surya',
  //   password: 'Surya9090.',
  //   phoneNumber: '+5412614324321'
  // })
  // console.log('registerResponses', await registerResponses);

  // confirmRegistration({
  //   code: '095285',
  //   username: 'alfins132@gmail.com'
  // })

  // const logIn = await loginCognito({
  //   username: 'alfins132@gmail.com',
  //   password: 'Surya9090.'
  // })
  // console.log('TOKEN', logIn.token)

  // const updateUserResponses = await updateUser({
  //   token: logIn?.token,
  //   userAttributes: {
  //     name: 'Alfin Surya',
  //     email: 'alfins132@gmail.com',
  //     familyName: 'Bos Surya 2',
  //   }
  // })

  // console.log('updateUserResponses', await updateUserResponses);
  // logIn.

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: 'authorization function',
    }),
  }
}
