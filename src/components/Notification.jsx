import { Alert } from '@mui/material'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  const style = {
    padding: '5px',
    border: '1px solid',
    marginTop: '10',
    marginBottom: '10'
  }


  return <Alert style={style} severity={type === 'error' ? 'error' : 'success'}>{message}</Alert>
}

export default Notification