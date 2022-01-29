
export type UserAttributes = {
  sub: string;
  email_verified: string;
  name: string;
  phone_number_verified: string;
  phone_number: string;
  family_name: string;
  email: string;
}

export type ASTCognitoUser = {
  Username: string;
  UserCreateDate: string;
  UserAttributes: UserAttributes
}
