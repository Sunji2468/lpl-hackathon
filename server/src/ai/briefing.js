import { ConverseCommand } from '@aws-sdk/client-bedrock-runtime';

import { bedrock } from '../aws/clients.js';
import { getClientDocumentContext } from '../aws/s3.js';
import { scheduleBedrock } from './bedrockLimiter.js';
import { briefingSchema } from './briefingSchema.js';
import { SYSTEM_PROMPT } from './prompts/systemPrompt.js';
import { buildBriefingPrompt } from './prompts/briefingPrompt.js';

function calculateMetrics(client) {
  const holdings = client.portfolio?.holdings ?? [];
  const cash = Number(client.portfolio?.cash ?? 0);

  const holdingsValue = holdings.reduce(
    (sum, holding) => sum + Number(holding.value ?? 0),
    0,
  );

  const totalPortfolioValue = holdingsValue + cash;

  const sectorValues = {};

  for (const holding of holdings) {
    const sector = holding.sector ?? 'Unknown';
    const value = Number(holding.value ?? 0);

    sectorValues[sector] =
      (sectorValues[sector] ?? 0) + value;
  }

  const sectorAllocation = {};

  if (totalPortfolioValue > 0) {
    for (const [sector, value] of Object.entries(
      sectorValues,
    )) {
      sectorAllocation[sector] =
        Math.round(
          (value / totalPortfolioValue) * 1000,
        ) / 10;
    }
  }

  const onboardingItems = Object.entries(
    client.onboarding ?? {},
  );

  const completedItems = onboardingItems.filter(
    ([, status]) => status === 'complete',
  ).length;

  const onboardingCompletion =
    onboardingItems.length === 0
      ? null
      : Math.round(
          (completedItems / onboardingItems.length) * 1000,
        ) / 10;
  const cashAllocation =
    totalPortfolioValue > 0
      ? Math.round((cash / totalPortfolioValue) * 1000) / 10
      : 0;
  
  return {
    totalPortfolioValue,
    cash,
    cashAllocation,
    sectorAllocation,
    onboardingCompletion,
  };
}

function extractJson(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');

  if (start === -1 || end === -1 || end <= start) {
    throw new Error('Bedrock did not return a JSON object');
  }

  return JSON.parse(text.slice(start, end + 1));
}

export async function generateClientBriefing(client) {
  const metrics = calculateMetrics(client);

  const documentContext =
    await getClientDocumentContext(client.id);

  const response = await scheduleBedrock(() =>
    bedrock.send(
      new ConverseCommand({
        modelId: process.env.BEDROCK_MODEL_ID,

        system: [
          {
            text: SYSTEM_PROMPT,
          },
        ],

        messages: [
          {
            role: 'user',
            content: [
              {
                text: buildBriefingPrompt(
                  client,
                  metrics,
                  documentContext,
                ),
              },
            ],
          },
        ],

        inferenceConfig: {
          maxTokens: 4000,
        },
      }),
    ),
  );

  const text = response.output.message.content
    .map((part) => part.text ?? '')
    .join('');

  console.log('\nRAW BEDROCK RESPONSE:\n', text)

  const briefing = briefingSchema.parse(
    extractJson(text),
  );

  return {
    metrics,
    sources: documentContext.map(
      (document) => document.source,
    ),
    briefing,
  };
}