import { render } from '@redwoodjs/testing/web'

import UserViewPage from './UserViewPage'

describe('UserViewPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<UserViewPage />)
    }).not.toThrow()
  })
})
