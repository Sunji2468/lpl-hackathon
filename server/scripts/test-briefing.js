import { generateClientBriefing } from '../src/ai/briefing.js';

const client = {
  id: 'demo-001',
  name: 'Jordan Lee',

  portfolio: {
    cash: 25000,
    holdings: [
      {
        symbol: 'AAPL',
        sector: 'Technology',
        assetClass: 'Equity',
        value: 120000,
      },
      {
        symbol: 'MSFT',
        sector: 'Technology',
        assetClass: 'Equity',
        value: 85000,
      },
      {
        symbol: 'BND',
        sector: 'Fixed Income',
        assetClass: 'Bond',
        value: 95000,
      },
    ],
  },

  onboarding: {
    identity: 'complete',
    riskProfile: 'complete',
    investmentObjective: 'complete',
    beneficiaries: 'missing',
    accountAgreement: 'complete',
    transferRequest: 'pending',
  },
};

const result = await generateClientBriefing(client);

console.log(JSON.stringify(result, null, 2));