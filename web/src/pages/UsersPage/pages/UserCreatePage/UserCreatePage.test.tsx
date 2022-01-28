import { render } from '@redwoodjs/testing/web'

import UserCreatePage from './UserCreatePage'

describe('UserCreatePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UserCreatePage />)
    }).not.toThrow()
  })
})
