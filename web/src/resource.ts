import { IResourceItem } from '@pankod/refine'
import { ResourceProps } from '@pankod/refine/dist/interfaces'
import UsersPage from 'src/pages/UsersPage/UsersPage'
import UserCreatePage from './pages/UsersPage/pages/UserCreatePage/UserCreatePage'
import UserEditPage from './pages/UsersPage/pages/UserEditPage/UserEditPage'
import UserViewPage from './pages/UsersPage/pages/UserViewPage/UserViewPage'

interface IResource extends IResourceItem, ResourceProps {}

const resources: IResource[] = [
  {
    name: 'users',
    list: UsersPage,
    canDelete: true,
    show: UserViewPage,
    edit: UserEditPage,
    create: UserCreatePage,
  },
]

export default resources
