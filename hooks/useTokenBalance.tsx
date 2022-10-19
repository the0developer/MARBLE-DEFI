import * as nearAPI from 'near-api-js'
import { convertMicroDenomToDenom } from 'util/conversion'
import { getCurrentWallet } from 'util/sender-wallet'
import { useDispatch } from 'react-redux'
import { NEAR_STATUS, DUST_STATUS } from 'store/types'
import { setCoinData } from 'store/actions/coinAction'
import axios from 'axios'
import { useEffect, useState, useMemo } from 'react'
import {
  getMultiplePoolsLiquidity,
  LiquidityInfoType,
  LiquidityReturnType,
} from 'hooks/usePoolLiquidity'
import { useTokenList } from 'hooks/useTokenList'
import { rewardToken, wNearToken } from 'util/constants'

export const getTokenBalance = async (tokenInfo) => {
  const { wallet } = getCurrentWallet()
  if (!tokenInfo) return 0
  if (!wallet.getAccountId()) return 0
  if (tokenInfo.symbol === 'NEAR') {
    const res = await wallet.account().getAccountBalance()
    return convertMicroDenomToDenom(Number(res.total), tokenInfo.decimals)
  }

  const hera = new nearAPI.Contract(
    wallet.account(), // the account object that is connecting
    tokenInfo.token_address,
    {
      viewMethods: ['ft_balance_of'],
      changeMethods: [],
    }
  )
  try {
    // @ts-ignore
    const res = await hera.ft_balance_of({
      account_id: wallet.account().accountId,
    })
    return convertMicroDenomToDenom(Number(res), tokenInfo.decimals)
  } catch (err) {
    return 0
  }
}

export const FetchCoinInfo = () => {
  const [tokenList] = useTokenList()
  const dispatch = useDispatch()
  // axios.get('https://')
  const [supportedTokens, pools] = useMemo(() => {
    const safePoolList = tokenList?.pools || []

    const poolIdsCollection = safePoolList
      .map(({ pool_id, token_address, decimals }) => {
        return { pool_id, token_address, decimals }
      })
      .filter(({ pool_id }) => {
        return !isNaN(pool_id)
      })

    return [tokenList, poolIdsCollection]
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [tokenList?.pools])
  useEffect(() => {
    // eslint-disable-line react-hooks/rules-of-hooks
    getMultiplePoolsLiquidity({
      pools,
    }).then(({ liquidity }: LiquidityReturnType) => {
      const near_dust =
        liquidity &&
        liquidity.filter(
          (_liquidity) =>
            _liquidity.tokens.includes(rewardToken) &&
            _liquidity.tokens.includes(wNearToken)
        )[0]
      const dustInNear =
        near_dust &&
        near_dust.reserve[near_dust.tokens.indexOf(wNearToken)] /
          near_dust.reserve[near_dust.tokens.indexOf(rewardToken)]
      setCoinData(DUST_STATUS, dustInNear, dispatch)
    })
  }, [pools])
  const url =
    'https://api.coingecko.com/api/v3/simple/price?ids=near&include_last_updated_at=true&vs_currencies=usd'
  useEffect(() => {
    // axios.get(url).then(({ data }) => {
    //   // console.log('api-data: ', data)
    //   // setNearData(NEAR_STATUS, data.near.usd, dispatch)
    //   setNearData(NEAR_STATUS, 2.89, dispatch)
    // })
    setCoinData(NEAR_STATUS, 2.89, dispatch)
  }, [])
  return null
}
