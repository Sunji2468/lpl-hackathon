export function adaptClientForBriefing(client) {
  const latestPortfolio =
    client.portfolioHistory?.[client.portfolioHistory.length - 1]

  const totalValue = Number(latestPortfolio?.totalValueUsd ?? 0)
  const allocation = latestPortfolio?.allocation ?? {}

  const valueFromPercent = (percent) =>
    Math.round(totalValue * (Number(percent ?? 0) / 100))

  const holdings = [
    {
      symbol: 'EQUITIES',
      sector: 'Equities',
      assetClass: 'Equity',
      value: valueFromPercent(allocation.equities),
    },
    {
      symbol: 'FIXED_INCOME',
      sector: 'Fixed Income',
      assetClass: 'Fixed Income',
      value: valueFromPercent(allocation.fixedIncome),
    },
  ].filter((holding) => holding.value > 0)

  return {
    ...client,

    portfolio: {
      cash: valueFromPercent(allocation.cash),
      holdings,
    },

    onboarding: {},
  }
}