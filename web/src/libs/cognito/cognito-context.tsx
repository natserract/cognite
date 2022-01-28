import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { loginUser, logout, userSession } from "src/api/Authorizations";
import { toast } from '@redwoodjs/web/toast'

export interface LoginInput {
  username: string;
  password: string;
}

export interface CurrentUser {
  email: string;
  name: string;
  [k: string]: any;
}

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

      if (logInFn) {
        setState({
          isAuthenticated: logInFn !== null,
          currentUser: logInFn.accessToken.payload,
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

  const setActiveState = useCallback(() => {
    const onFetch = async () => {
      const token = localStorage.getItem('token');

      if (token !== null) {
        const currentUser = await userSession();
        console.log("SESSION", currentUser)

        setState({
          currentUser,
          isAuthenticated: true
        })
      }
    }

    onFetch()
  }, [])

  useEffect(setActiveState, [])

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
