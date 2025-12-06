import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

const mockHandler = vi.fn()

describe('<Togglable />', () => {
  beforeEach(() => {
    render (
      <Togglable showButton="view">
        <div>
          'www.testurl.com' {<br/>}
          0  <button onClick={mockHandler}>like</button> {<br/>}
        </div>
      </Togglable>
    )
  })

  test('url and likes show when view button is clicked', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const url = screen.getByText('www.testurl.com', {exact:false})
    const likes = screen.getByText(0, {exact:false})

    expect(url).toBeVisible()
    expect(likes).toBeVisible()
  })

  test('clicking like twice calls event handler twice', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)

    const likeBtn = screen.getByText('like')
    await user.click(likeBtn)
    await user.click(likeBtn)
    expect(mockHandler.mock.calls).toHaveLength(2)
  })
})

