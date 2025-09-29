const Notification = ({type, message}) => {
  if (message === null) {
    return null
  }

  const mainStyle = {
    padding: '15px 20px',
    borderRadius: '4px',
    boxShadow: '1px 7px 14px -5px rgba(0,0,0,0.2)',
    marginBottom: '15px'
  }

  const typeStyle = type === 'success' ? {
    color: '#3d4632ff',
    backgroundColor: '#c5ef95ff',
    borderWidth: '1px 1px 1px 6px',
    borderStyle: 'solid',
    borderColor: '#95c460ff'
  } : type === 'error' ? {
    color: '#2e2121ff',
    backgroundColor: '#ecbab6ff',
    borderWidth: '1px 1px 1px 6px',
    borderStyle: 'solid',
    borderColor: '#c05857ff'
  } : {}

  const messageStyle = {...mainStyle, ...typeStyle}
  
  return (
    <div style={messageStyle}>
      {message}
    </div>
  )
}

export default Notification