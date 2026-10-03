import { useState } from 'react'
import './App.css'

function App() {

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e) => {
    e.preventDefault()

    if(email=== 'client@lpl.com' && password === 'pass123'){
      window.location.href = '/dashboard'
    } else {
      setError('Invalid email or password')
    }
  }


  return (
    <div className="loginPage">

      <header className="header">
        <div className="logo">LPL Financial</div>
      </header>

      <main className="loginBox">

        <div className="loginContent">

          <div className="loginHeader">
            <h1>Welcome back!</h1>
            <p>Sign in to your client account</p>
          </div>

          <form className="loginForm" onSubmit={handleLogin}>

            <div className="formGroup">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="formGroup">
              <div className="passLabel">
                <label htmlFor="password">Password</label>

                
              </div>

              <div className="passInput">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  className="showButton"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button type="button" className="forgotButton">
                  Forgot password?
            </button>

            <label className="remember">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>

            {error && <div className="errorLogin">{error}</div>}
            <button type="submit" className="LogInButton">
              Log in
            </button>

          </form>

        

        </div>

      </main>

    </div>
  )
}

export default App