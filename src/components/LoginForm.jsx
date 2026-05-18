import { Button, TextField } from '@mui/material'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <TextField label="username" value={username} onChange={handleUsernameChange}/>
        </div>
        <div>
          <TextField label="password" type="password" value={password} onChange={handlePasswordChange} />
        </div>
        <Button type="submit" variant="contained" style={{ marginTop:10 }}>Login</Button>
      </form>
    </div>
  )
}

export default LoginForm