import { generateClientBriefing } from '../src/ai/briefing.js';

const cases = [
  {
    name: 'complete onboarding',
    client: {
      id: 'eval-complete',
      name: 'Taylor Smith',
      portfolio: {
        cash: 10000,
        holdings: [
          {
            symbol: 'VOO',
            sector: 'Broad Market',
            assetClass: 'Equity',
            value: 90000,
          },
        ],
      },
      onboarding: {
        identity: 'complete',
        riskProfile: 'complete',
        investmentObjective: 'complete',
        beneficiaries: 'complete',
        accountAgreement: 'complete',
        transferRequest: 'complete',
      },
    },
  },

  {
    name: 'missing information',
    client: {
      id: 'eval-missing',
      name: 'Morgan Davis',
      portfolio: {
        cash: 5000,
        holdings: [],
      },
      onboarding: {
        identity: 'complete',
        beneficiaries: 'missing',
      },
    },
  },

  {
    name: 'zero portfolio',
    client: {
      id: 'eval-zero',
      name: 'Casey Brown',
      portfolio: {
        cash: 0,
        holdings: [],
      },
      onboarding: {},
    },
  },
];

for (const testCase of cases) {
  console.log(`\n--- ${testCase.name} ---`);

  try {
    const result = await generateClientBriefing(
      testCase.client,
    );

    console.log(
      JSON.stringify(result, null, 2),
    );
  } catch (error) {
    console.error(error);
  }
}