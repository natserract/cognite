import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider'

type X = Omit<CognitoIdentityServiceProvider.GetUserResponse, 'UserAttributes'>

export type UserAttributes = {
  sub: string;
  email_verified: string;
  name: string;
  phone_number_verified: string;
  phone_number: string;
  family_name: string;
  email: string;
}

export type ASTCognitoUser = X & {
  UserAttributes: UserAttributes
}
