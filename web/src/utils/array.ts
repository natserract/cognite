import { CrudFilter, CrudFilters, CrudOperators, CrudSorting, DataProvider } from "@pankod/refine";
import setWith from 'lodash.setwith'

type RecordRow = Record<string, any>

// Integrate with where types in redwood
type RedwoodOperator =
  | 'in'
  | 'notIn'
  | 'equals';
type ForceOperator = RedwoodOperator | CrudOperators | any;

export function iterToObject<T>(
  items: T[] | undefined,
  keyProp: string,
  keyValue?: string,
) {
  let objects: { [key: string]: T } = {}

  if (items && items.length) {
    items.map((val: RecordRow) => {
      let objKeys: string[] = []

      // Check if have nested field
      if (String(val[keyProp]).includes(',')) {
        objKeys = String(val[keyProp]).split(',');
      } else {
        objKeys = [val[keyProp]]
      }

      // Mutable sets values for objects
      // Support for nested fields, or one field
      setWith(objects,
        objKeys,
        keyValue ? val[keyValue] : val,
        Object)
    })
  }

  if (!Object.keys(objects).length) return undefined

  // Prisma: Argument orderBy of type DonationOrderByWithRelationInput needs exactly one argument
  // Remove object key, get from the last value
  if (Object.keys(objects).length > 1) {
    const key = Object.keys(objects)[0]
    delete objects[key]
  }

  return objects
}

export function generateFilter(iters: { [key: string]: CrudFilter; }) {
  const objects: { [key: string]: any } = {}
  const filterBy = iters && Object.values(iters);

  const parseOperator = (operate: ForceOperator) => {
    let operator = ""

    switch (operate) {
      case 'nin':
        operator = "notIn"
        break;
      case 'eq':
        operator = "equals"
        break;
      default:
        return operate
    }

    return operator
  }

  if (!filterBy) return undefined

  filterBy.map(val => {
    objects[val?.field] = {
      [parseOperator(val.operator)]: val.value
    }
  })

  return objects
}
