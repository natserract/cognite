import { render } from '@redwoodjs/testing/web'

import UserEditPage from './UserEditPage'

describe('UserEditPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UserEditPage />)
    }).not.toThrow()
  })
})
