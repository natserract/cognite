import { Link, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

const UserEditPage = () => {
  return (
    <>
      <MetaTags title="UserEdit" description="UserEdit page" />

      <h1>UserEditPage</h1>
      <p>
        Find me in <code>./web/src/pages/UserEditPage/UserEditPage.tsx</code>
      </p>
      <p>
        My default route is named <code>userEdit</code>, link to me with `
      </p>
    </>
  )
}

export default UserEditPage
