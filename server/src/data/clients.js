import { readFile } from 'node:fs/promises'

const clientsUrl = new URL('../../data/clients.json', import.meta.url)

export async function getClientById(clientId) {
  const text = await readFile(clientsUrl, 'utf8')
  const clients = JSON.parse(text)

  return clients.find((client) => client.id === clientId) ?? null
}