import { useState, useImperativeHandle } from 'react'

const Togglable = (props) => {
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(props.ref, () => {
    return { toggleVisibility }
  })

  return (
    <span>
      <span style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.showButton}</button>
      </span>
      {visible && (
        <div style={showWhenVisible}>
          {props.children}
          <button onClick={toggleVisibility}>{props.hideButton}</button>
        </div>
      )}

    </span>
  )
}

export default Togglable