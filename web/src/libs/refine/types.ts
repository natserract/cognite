import { VariableOptions } from '@pankod/refine/dist/interfaces/metaData/variableOptions'
import { Fields } from '@pankod/refine/dist/interfaces/metaData/fields'
import { CrudFilters, CrudSorting } from '@pankod/refine'

export enum DocumentType {
  Query,
  Mutation,
  Subscription,
}

type MetaDataQuery = {
  operation?: string
  fields?: Fields
  variables?: VariableOptions
  input?: { [l: string]: any }
  [k: string]: any
}

export type GetManyArgs = {
  id?: string
  ids?: string[]
  resource: string
  variables: any[]
  metaData?: MetaDataQuery
  requestHeaders?: HeadersInit | undefined,
  isCustom?: boolean,
}

type Pagination = {
  current: number
  pageSize: number
}

export type GetListArgs = GetManyArgs & {
  pagination: Pagination
  sort: CrudSorting
  filters: CrudFilters
  requestHeaders?: HeadersInit | undefined
}
