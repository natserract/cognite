import { stringify } from 'querystring';
import Axios from 'axios';
import { API_BASE_URL, GRAPHQL_ENDPOINT } from 'src/constants/endpoint';
import { removeToken } from 'src/utils/token';

export const loginUser = async (username: string, password: string) => {
  return Axios.post(
    API_BASE_URL + '/signin',
    {
      username,
      password
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then(
    (response) => {
      const { data } = response.data;

      if (data.error) return Promise.reject()

      const token = data.accessToken.jwtToken
      localStorage.setItem('token', token);

      return data
    },
    (error) => {
      const errorResponse = error.response;
      return Promise.reject({ ...errorResponse })
    }
  )
}

export const currentUser = async (token: string) => {
  return Axios.post(
    GRAPHQL_ENDPOINT,
    {
      query: `
        query GetUserCognito($token: String!) {
          getUserCognito(token: $token) {
            Username
            UserAttributes
            UserCreateDate
          }
        }
      `,
      variables: {
        token,
      }
    }
  ).then(
    (response) => {
      const { data } = response.data;

      if (data.error) return Promise.reject()
      return data
    },
    (error) => {
      const errorResponse = error.response;
      return Promise.reject({ ...errorResponse })
    }
  )
}

export const userSession = async () => {
  return Axios.post(
    GRAPHQL_ENDPOINT,
    {
      query: `
        query Session {
          getSession
        }
      `
    }
  ).then(
    (response) => {
      const { data } = response.data;
      if (!data.getSession) return null

      const access = data.getSession.idToken
      const userData = access.payload

      return userData
    },
    (error) => {
      const errorResponse = error.response;
      return Promise.reject({ ...errorResponse })
    }
  )
}

export const logout = async () => {
  return Axios.get(
    API_BASE_URL + '/signout',
  ).then(
    () => {
      removeToken();
      window.location.href = window.location.origin + '/login'
    },
    (error) => {
      const errorResponse = error.response;
      return Promise.reject({ ...errorResponse })
    }
  )
}

type UpdateUserArgs = {
  email: string,
  name: string,
  password: string,
  phoneNumber: string,
  familyName?: string,
  lastName?: string,
  tenantId?: string,
}

export const updateUser = async (payloads: UpdateUserArgs) => {
  return Axios.post(
    API_BASE_URL + '/updateUser',
    { ...payloads },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  ).then(
    (response) => {
      return response
    },
    (error) => {
      const errorResponse = error.response;
      return Promise.reject({ ...errorResponse })
    }
  )
}
