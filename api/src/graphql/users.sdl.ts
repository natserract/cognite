export const schema = gql`
  type CognitoUser {
    Users: JSON
  }

  type GetCognitoUser {
    Username: String
    UserAttributes: JSON
    UserCreateDate: Date
    UserLastModifiedDate: Date
    Enabled: Boolean
    UserStatus: String
    given_name: String
    family_name: String
    email: String
    phone_number: String
    locale: String
    zoneinfo: String
  }

  input UserInput {
    userAttributes: JSON
  }

  input CreateUserInput {
    email: String!
    name: String!
    familyName: String
    phoneNumber: String!
    password: String!
    lastName: String
    tenantId: String
  }

  input VerifyUserInput {
    code: String!
    username: String!
  }

  type Query {
    listUserCognito(search: JSON): CognitoUser @skipAuth
    getUserCognito(username: String): GetCognitoUser @skipAuth
  }

  type Mutation {
    createUserCognito(input: UserInput!): JSON @skipAuth
    verifyUserCognito(input: VerifyUserInput): JSON @skipAuth
    deleteUserCognito(input: String): Boolean! @skipAuth
  }
`
