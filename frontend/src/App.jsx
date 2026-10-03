import { useState } from 'react'
import { login } from './api/auth.js'
import './App.css'
import Dashboard from './Dashboard'

function App() {

  const [showPassword, setShowPassword] = useState(false)
  const [page, setPage] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
<<<<<<< HEAD
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [session, setSession] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (isLoading) return
    setError('')
    setIsLoading(true)
    try {
      setSession(await login(email, password))
      setPassword('')
      setShowPassword(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }

  const [loginError, setLoginError] = useState('')

  const handleLogin = (event) => {
    event.preventDefault()
    setLoginError('')

    if (email === 'client@lpl.com' && password === 'pass123') {
      setPage('dashboard')
    } else {
      setLoginError('Invalid email or password')
    }
}


    if (page === 'dashboard') {
    return <Dashboard />
  }

  return (
    <div className="loginPage">

      <header className="header">
        <div className="logo">LPL Financial</div>
      </header>

      <main className="loginBox">

        <div className="loginContent">

          {session ? (
            <section className="loginHeader" aria-label="Signed-in account">
              <h1>You’re signed in</h1>
              <p>{session.user.email}</p>
              <button type="button" className="LogInButton" onClick={() => {
                setSession(null)
                setPassword('')
                setError('')
              }}>
                Sign out
              </button>
            </section>
          ) : <>
          <div className="loginHeader">
            <h1>Welcome back!</h1>
            <p>Sign in to your client account</p>
          </div>

          <form className="loginForm" onSubmit={handleLogin} aria-busy={isLoading}>

            <div className="formGroup">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                disabled={isLoading}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
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
                  required
                  autoComplete="current-password"
                  disabled={isLoading}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                />

                <button
                  type="button"
                  className="showButton"
                  disabled={isLoading}
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

<<<<<<< HEAD
            {error && <div className="errorLogin" role="alert">{error}</div>}
            <button type="submit" className="LogInButton" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Log in'}
=======
            {loginError && <div className="errorLogin">{loginError}</div>}
            <button type="submit" className="LogInButton">
              Log in
>>>>>>> 5b423fb (Polish dashboard and login layout)
            </button>

          </form>
          </>}

        

        </div>

      </main>

    </div>
  )
}

export default App
