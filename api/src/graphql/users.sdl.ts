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

  input CreateUserCognitoInput {
    email: String!
    name: String!
    familyName: String
    phoneNumber: String!
    password: String!
    lastName: String
    tenantId: String
  }

  input VerifyUserCognitoInput {
    code: String!
    username: String!
  }

  type Query {
    listUserCognito(search: JSON): CognitoUser @skipAuth
    getUserCognito(username: String!): GetCognitoUser @skipAuth
    getSession: JSON @skipAuth
  }

  type Mutation {
    createUserCognito(input: CreateUserCognitoInput!): JSON @skipAuth
    verifyUserCognito(input: VerifyUserCognitoInput!): JSON @skipAuth
    deleteUserCognito(username: String!): Boolean! @skipAuth
  }
`
