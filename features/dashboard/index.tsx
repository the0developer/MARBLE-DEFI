import { useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { Stack, HStack } from '@chakra-ui/react'
import { LiquidityInfoType, LiquidityReturnType } from 'hooks/usePoolLiquidity'
import { Staked, Reward, Bonded, APR } from 'icons'
import { useTokenList } from 'hooks/useTokenList'
import { getMultiplePoolsLiquidity } from 'hooks/usePoolLiquidity'
import StyledCard from './components/StateCard'
import {
  getFarms,
  getSeeds,
  getStakedListByAccountId,
  getRewards,
  FarmInfo,
} from 'util/farm'
import { DEFAULT_PAGE_LIMIT } from 'util/pool'
import db from 'store/RefDatabase'
const page = 1
const perPage = DEFAULT_PAGE_LIMIT

export const Dashboard = () => {
  const [tokenList] = useTokenList()
  const [isLoading, setIsloading] = useState(false)
  const [liquidity, setLiquidity] = useState<LiquidityInfoType[]>()
  const [farms, setFarms] = useState<FarmInfo[]>()
  const rewardToken = 'dust.cmdev0.testnet'
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
  const getNearDollarValue = async () => {
    // const url = "https://api.coingecko.com/api/v3/simple/price?ids=near&include_last_updated_at=true&vs_currencies=usd"
    // const res = await axios.get(url)
    // let res
    // if (res.data?.near.usd)
    //   return res.data?.near.usd
    // else
    return '4.5405'
  }
  useEffect(() => {
    setIsloading(true)
    console.log('loading called: ')
    // eslint-disable-line react-hooks/rules-of-hooks
    getMultiplePoolsLiquidity({
      pools,
    }).then(({ liquidity }: LiquidityReturnType) => {
      console.log('loading finished: ', liquidity)
      setLiquidity(liquidity)
      if (liquidity.length > 0) loadFarmInfoList(liquidity, tokenList?.pools)
      setIsloading(false)
    })
  }, [pools])
  const loadFarmInfoList = async (liquidity, pools) => {
    let Params: [
      Promise<Record<string, string>>,
      Promise<Record<string, string>>,
      Promise<Record<string, string>>,
      Promise<string>
    ]
    Params = [
      getStakedListByAccountId({}),
      getRewards({}),
      getSeeds({}),
      getNearDollarValue(),
    ]

    const resolvedParams: [
      Record<string, string>,
      Record<string, string>,
      Record<string, string>,
      string
    ] = await Promise.all(Params)

    const stakedList: Record<string, string> = resolvedParams[0]
    const rewardList: any = resolvedParams[1]
    const seeds: Record<string, string> = resolvedParams[2]
    const tokenPrice: string = resolvedParams[3]
    const tokenPriceList = {
      // Todo: this needs to be changed to dust
      [rewardToken]: {
        price: tokenPrice,
      },
    }

    const farms = await getFarms({
      page,
      perPage,
      stakedList,
      rewardList,
      tokenPriceList,
      seeds,
      liquidity,
      pools,
    })
    setFarms(farms)
    await db.cacheFarms(farms)
    const farmsCahced = await db.queryFarms()

    console.log('Farm fetch all: farms: ', farms, farmsCahced)
  }
  const getTVL = () => {
    let tvl = 0
    if (!farms) return '0'
    farms.forEach((farm) => {
      console.log('farm: ', farm)
      if (!farm) return
      tvl += farm.pool.tvl
    })
    return tvl.toFixed(2)
  }
  return (
    <StyledDivForWrapper>
      <Stack spacing="30px">
        <StyldedGrid>
          <StyledCard
            color="#99E39E"
            icon={<Staked />}
            title={
              <Title>
                Staked
                <br />
                Marble
              </Title>
            }
            value={<Value>51.76%</Value>}
          />
          <StyledCard
            color="#FE9A45"
            icon={<Bonded />}
            title={
              <Title>
                Bonded Liquidity
                <br />
                Ratio
              </Title>
            }
            value={<Value>59.86%</Value>}
          />
          <StyledCard
            color="#B0954A"
            icon={<Reward />}
            title={
              <Title>
                Daily Dao Staking
                <br />
                Reward
              </Title>
            }
            value={<Value>136986.3</Value>}
          />
          <StyledCard
            color="#FF5368"
            icon={<APR />}
            title={
              <Title>
                Liquidity Staking
                <br />
                APR
              </Title>
            }
            value={<Value>Up to 260.41%</Value>}
          />
        </StyldedGrid>
        <Value>Protocol Stats</Value>
        <StateContent>
          <StateElement>
            <Title>Liquidity Pools</Title>
            <Value>${getTVL()}</Value>
          </StateElement>
          <StateElement>
            <Title>Bonded Liquidity</Title>
            <Value>$61,971.74</Value>
          </StateElement>
          <StateElement>
            <Title>Staked Marble</Title>
            <Value>$61,971.74</Value>
          </StateElement>
          <StateElement>
            <Title>Treasury</Title>
            <Value>$61,971.74</Value>
          </StateElement>
        </StateContent>
      </Stack>
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled.div`
  padding: 80px;
  position: relative;
  @media (max-width: 1550px) {
    padding: 40px;
  }
`
const StyldedGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-column-gap: 30px;
  @media (max-width: 1550px) {
    grid-column-gap: 15px;
  }
`
const Title = styled.div`
  font-size: 16px;
  color: #a1a1a1;
  font-weight: 500;
  @media (max-width: 1550px) {
    font-size: 14px;
  }
`

const Value = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: white;
  @media (max-width: 1550px) {
    font-size: 20px;
  }
`
const StateContent = styled.div`
  padding: 20px;
  background: rgba(5, 6, 22, 0.2);
  border-radius: 20px;
  display: flex;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6d6d78;
  backdrop-filter: blur(40px);
  justify-content: space-around;
`
const StateElement = styled.div`
  text-align: center;
`
