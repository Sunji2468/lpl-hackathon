export async function generateBriefing(clientId, session) {
  const token =
    session?.token ??
    session?.accessToken ??
    session?.access_token

  const response = await fetch(`/api/advisor/briefing/${clientId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error ?? 'Unable to generate briefing')
  }

  return data
}