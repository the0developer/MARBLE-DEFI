import { useSelector } from 'react-redux'

export const useNearDollarValue = () => {
  const state = useSelector((state: any) => state)
  return state.coinData.near_value
}

// export const useTokenDollarValue = (tokenSymbol?: string) => {
//   const { symbol: baseTokenSymbol } = useBaseTokenInfo() || {}
//   const tokenInfo = useTokenInfo(tokenSymbol)

//   const tokenSymbolToLookupDollarValueFor = tokenInfo?.id
//     ? tokenSymbol
//     : baseTokenSymbol
//   const [[tokenDollarPrice], fetchingTokenDollarPrice] =
//     useTokenDollarValueQuery(
//       tokenSymbolToLookupDollarValueFor
//         ? [tokenSymbolToLookupDollarValueFor]
//         : null
//     )
//   const [oneTokenToTokenPrice, fetchingTokenToTokenPrice] = usePriceForOneToken(
//     {
//       tokenASymbol: tokenSymbol,
//       tokenBSymbol: baseTokenSymbol,
//     }
//   )

//   const [tokenPrice, isPriceLoading] = useTokenToTokenPrice({
//     tokenASymbol: baseTokenSymbol,
//     tokenBSymbol: tokenSymbol,
//     tokenAmount: 1,
//   })

//   /* if the token has an id or it's the baseToken then let's return pure price from the api */
//   const shouldRenderPureDollarPrice =
//     tokenSymbol === baseTokenSymbol || Boolean(tokenInfo?.id)
//   if (shouldRenderPureDollarPrice) {
//     return [tokenDollarPrice * tokenPrice, fetchingTokenDollarPrice] as const
//   }

//   /* otherwise, let's query the chain and calculate the dollar price based on ratio to base token */
//   return [
//     tokenDollarPrice * oneTokenToTokenPrice,
//     fetchingTokenDollarPrice || fetchingTokenToTokenPrice,
//   ] as const
// }

// export const useTokenDollarValueQuery = (tokenSymbols?: Array<string>) => {
//   const { data, isLoading } = useQuery(
//     [`coinDollarValue/${tokenSymbols?.join('/')}`] as QueryKey,
//     async (): Promise<Array<number>> => {
//       const tokenIds = tokenSymbols.map(
//         (tokenSymbol) =>
//           (unsafelyGetTokenInfo(tokenSymbol) || getIBCAssetInfo(tokenSymbol))
//             ?.id
//       )

//       const response = await fetch(getApiUrl(tokenIds), {
//         method: 'GET',
//       })

//       const prices = await response.json()
//       return tokenIds.map((id): number => prices[id]?.usd || 0)
//     },
//     {
//       enabled: Boolean(tokenSymbols?.length),
//       refetchOnMount: 'always',
//       refetchInterval: DEFAULT_TOKEN_BALANCE_REFETCH_INTERVAL,
//       refetchIntervalInBackground: true,
//     }
//   )

//   return [data || [], isLoading] as const
// }

function getApiUrl(tokenIds: Array<string>) {
  return `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds.join(
    ','
  )}&vs_currencies=usd`
}
