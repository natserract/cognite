import { IResourceItem } from '@pankod/refine'
import { ResourceProps } from '@pankod/refine/dist/interfaces'
import HomePage from 'src/pages/HomePage/HomePage'

interface IResource extends IResourceItem, ResourceProps {}

const resources: IResource[] = [
  {
    name: 'home',
    list: HomePage,
    canDelete: true,
  },
]

export default resources
