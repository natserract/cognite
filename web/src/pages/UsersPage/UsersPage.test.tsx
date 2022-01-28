import { render } from '@redwoodjs/testing/web'

import UsersPage from './UsersPage'

describe('HomePage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UsersPage />)
    }).not.toThrow()
  })
})
