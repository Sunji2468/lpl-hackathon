import { getClientById } from '../src/data/clients.js'
import { adaptClientForBriefing } from '../src/ai/clientAdapter.js'
import { generateClientBriefing } from '../src/ai/briefing.js'

const rawClient = await getClientById('client-001')

if (!rawClient) {
  throw new Error('Client not found')
}

const client = adaptClientForBriefing(rawClient)

const result = await generateClientBriefing(client)

console.log(JSON.stringify(result, null, 2))