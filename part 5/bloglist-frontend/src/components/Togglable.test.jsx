import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Togglable from './Togglable'

describe('<Togglable />', () => {
  beforeEach(() => {
    render (
      <Togglable showButton="view">
        <div>
          'www.testurl.com' {<br/>}
          0  <button>like</button> {<br/>}
        </div>
      </Togglable>
    )
    screen.debug()
  })

  test('url and likes show when view button is clicked', async () => {
    // render (
    //   <Togglable showButton="view">
    //     <div>
    //       'www.testurl.com' {<br/>}
    //       0  <button>like</button> {<br/>}
    //     </div>
    //   </Togglable>
    // )
    // screen.debug()
    const mockHandler = vi.fn()
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    // expect(button).toBeDefined()
    // expect(mockHandler.mock.calls).toHaveLength(1)
    
    const el = screen.getByText('www.testurl.com', {exact:false})
    screen.debug(el)
    expect(el).toBeVisible()
  })
})

