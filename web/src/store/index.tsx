import { RefineProps } from '@pankod/refine/dist/components/containers/refine'
import { createElement } from 'react'

export const AllContextProvider: React.FC<RefineProps> = ({ children, ...rest }) =>
  createElement(() => <React.Fragment />, { ...rest }, children)
