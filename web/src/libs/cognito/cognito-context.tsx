import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { loginUser, logout, userSession, currentUser } from "src/api/Authorizations";
import { toast } from '@redwoodjs/web/toast'
import { removeToken } from "src/utils/token";
import { ASTCognitoUser } from "./types";

export interface LoginInput {
  username: string;
  password: string;
}

export interface CurrentUser extends ASTCognitoUser {};
export interface CognitoContextInterface {
  isAuthenticated: boolean
  currentUser: CurrentUser
  logIn: (username: string, password: string) => Promise<Record<string, any>>
  logOut: () => Promise<string | void>
}

export const CognitoContext = createContext<CognitoContextInterface>({
  isAuthenticated: false,
  currentUser: null,
  logIn: async () => ({}),
  logOut: async () => { },
})

type Props = {}

export const CognitoProvider: React.FC<Props> = (props) => {
  // const navigation = useNavigation()

  const [state, setState] =
    useState<Pick<CognitoContextInterface, 'isAuthenticated' | 'currentUser'>>({
      isAuthenticated: false,
      currentUser: null,
    })

  const logIn = useCallback(async (
    username: string,
    password: string
  ) => {
    try {
      const logInFn = await loginUser(username, password);
      const user = await currentUser(logInFn.accessToken.jwtToken)

      if (logInFn) {
        setState({
          isAuthenticated: logInFn !== null,
          currentUser: { ...user.getUserCognito },
        })

        return logInFn
      }
    } catch (error) {
      toast.error(`Error loginUser: ${error}`)
      console.error(error)
    }
  }, [])

  const logOut = useCallback(async () => {
    await logout();
    setState({
      currentUser: null,
      isAuthenticated: false,
    })

    return Promise.resolve('/login');
  }, [])

  const setAuthenticated = useCallback(() => {
    const onFetch = async () => {
      const token = localStorage.getItem('token');

      if (token !== null) {
        setState({
          ...state,
          isAuthenticated: true
        })
      }
    }

    onFetch()
  }, [])

  useEffect(setAuthenticated, [])

  const getCurrentUser = useCallback(() => {
    const onFetchCurrentUser = async () => {
      const token = localStorage.getItem('token');

      if (token !== null) {
        const user = await currentUser(token)

        if (user) {
          setState({
            isAuthenticated: true,
            currentUser: { ...user.getUserCognito }
          })
        }
      }
    }

    onFetchCurrentUser()
  }, []);

  useEffect(getCurrentUser, [])

  // Prevents unnecessary renders
  const value = useMemo(
    () => ({
      ...state,
      logIn,
      logOut,
    }),
    [
      state,
      logIn,
      logOut,
    ]
  )

  return (
    <CognitoContext.Provider value={value}>
      {props.children}
    </CognitoContext.Provider>
  )
}
