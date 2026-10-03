export async function login(email, password) {
  // Temporary demo login — local development only.
if (
  import.meta.env.DEV &&
  email.trim().toLowerCase() === 'client@lpl.com' &&
  password === 'pass123'
) {
  return {
    user: {
      id: 'demo-advisor',
      email: 'demo@example.com',
    },
    token: null,
    isDemo: true,
  }
}
  let response
  try {
    response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: AbortSignal.timeout(15000),
    })
  } catch {
    throw new Error('Cannot reach the server. Please try again.')
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const fallback = response.status >= 500
      ? 'Sign-in is temporarily unavailable. Please try again.'
      : 'Unable to sign in. Please try again.'
    throw new Error(response.status < 500 && typeof data?.error === 'string'
      ? data.error
      : fallback)
  }
  if (typeof data?.token !== 'string' || !data.token ||
      typeof data?.user?.id !== 'string' || typeof data?.user?.email !== 'string') {
    throw new Error('The server returned an invalid login response. Please try again.')
  }
  return { user: data.user, token: data.token }
}
