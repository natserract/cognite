import React, {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AuthContextInterface } from './types'
import { AuthProvider as AuthProviderTypes, useGetIdentity, useOne, Refine } from '@pankod/refine'
import { RefineProps } from '@pankod/refine/dist/components/containers/refine'
import { loginUser } from 'src/api/Authorizations'

export const AuthContext = React.createContext<AuthContextInterface>({
  loading: true,
  isAuthenticated: false,
  currentUser: null,
  logIn: async () => { },
  logOut: async () => { },
  getToken: async () => '',
})

type Props = {} & RefineProps

export const AuthProvider: React.FC<Props> = ({ children, ...rest }) => {
  const [state, setState] =
    useState<Pick<AuthContextInterface, 'loading' | 'isAuthenticated' | 'currentUser'>>({
      loading: true,
      isAuthenticated: false,
      currentUser: null,
    })

  // invoke -> getProfile if null
  // invoke -> loginCognito
  const authProvider: AuthProviderTypes = {
    login: async (payloads) => {
      const { username, password } = payloads
      Promise.reject()

      try {
        // const response = await loginUser(username, password);
        // console.log('Response', response)

        // Promise.resolve(response)
      } catch (error) {
        // window.location.href = window.location.origin + '/login'
        // Promise.reject(error)
      }
    },
    logout: () => Promise.resolve(),
    checkAuth: () => Promise.resolve(),
    checkError: () => Promise.resolve(),
    getPermissions: () => Promise.resolve(),
    getUserIdentity: () => Promise.resolve(),
  }

  // Prevents unnecessary renders
  const value = useMemo(
    () => ({
      ...state,
      authProvider,
    }),
    [state, authProvider]
  )

  return (
    <Refine
      authProvider={value.authProvider}
      children={children}
      {...rest}
    />
  )
}
