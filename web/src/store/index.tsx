import { RefineProps } from '@pankod/refine/dist/components/containers/refine'
import { createElement } from 'react'
import { AuthProvider } from './auth/auth.store'

export const AllContextProvider: React.FC<RefineProps> = ({ children, ...rest }) =>
  createElement(AuthProvider, { ...rest }, children)
