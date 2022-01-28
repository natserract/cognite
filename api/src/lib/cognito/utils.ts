import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider'
import setWith from 'lodash.setwith'

type UserAttributes = CognitoIdentityServiceProvider.AttributeListType
type UserAttributesReturn = {
  [t: string]: {
    [key: string]: CognitoIdentityServiceProvider.AttributeType;
  }
}

type AttributeType = {
  Name: string,
  Value: string,
}

export const parseUserAttributes = (
  values: UserAttributes,
  objects = {},
  key = 'UserAttributes',
): UserAttributesReturn => {
  const userAttributes = Array.from(values) as UserAttributes;

  userAttributes.map(({ Name, Value }) => {
    setWith(
      objects,
      `[${key}][${Name}]`,
      Value,
      Object
    )
  })

  return objects as UserAttributesReturn
}
