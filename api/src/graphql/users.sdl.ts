export const schema = gql`
  type Return {
    message: String
  }

  type Query {
    usersCustom: Return! @skipAuth
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

  type Mutation {
    createUser(input: CreateUserInput): Return! @skipAuth
    verifyUser(input: VerifyUserInput): Return! @skipAuth
  }
`
