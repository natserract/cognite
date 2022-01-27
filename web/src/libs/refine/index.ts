import { GraphQLClient } from 'graphql-request'
import { GRAPHQL_ENDPOINT } from 'src/constants/endpoint'

const authHeaders = {
  authorization: 'Bearer ' + 'MY_TOKEN',
}

const client = new GraphQLClient(GRAPHQL_ENDPOINT, {
  headers: {
    ...authHeaders,
  },
})

export default client
