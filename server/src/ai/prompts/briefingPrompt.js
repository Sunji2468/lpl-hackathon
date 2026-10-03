export function buildBriefingPrompt(
  client,
  metrics,
  documentContext,
) {
  return `
Create a concise pre-meeting briefing for this client.

Prioritize:
1. Important portfolio characteristics
2. Missing or pending onboarding information
3. Items requiring advisor attention
4. Useful questions for the upcoming client conversation

Do not provide investment recommendations.
Do not make unsupported assumptions.
Avoid generic filler.

CLIENT DATA:
${JSON.stringify(client, null, 2)}

CALCULATED METRICS:
${JSON.stringify(metrics, null, 2)}

DOCUMENT CONTEXT:
${JSON.stringify(documentContext, null, 2)}

Return exactly this JSON structure:

{
  "clientSummary": "short 2-3 sentence briefing",
  "portfolioHighlights": [
    {
      "finding": "string",
      "evidence": "specific supplied field, metric, or document"
    }
  ],
  "attentionItems": [
    {
      "priority": "high | medium | low",
      "finding": "string",
      "evidence": "specific supplied field, metric, or document"
    }
  ],
  "onboarding": {
    "status": "complete | in_progress | not_available",
    "missing": ["string"],
    "pending": ["string"]
  },
  "questionsForClient": ["string"]
}
`;
}