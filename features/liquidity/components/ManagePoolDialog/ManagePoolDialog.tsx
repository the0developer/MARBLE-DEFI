import { Button, ChakraProvider, HStack, Stack } from '@chakra-ui/react'
import { Dialog, StyledCloseIcon } from 'components/Dialog'
import { LiquidityInput } from 'components/LiquidityInput'
import { Text } from 'components/Text'
import { usePoolList } from 'hooks/usePoolList'
import { getTokenBalance } from 'hooks/useTokenBalance'
import { useNearDollarValue } from 'hooks/useTokenDollarValue'
import {
  unsafelyGetTokenInfoFromAddress,
  useTokenInfoByPoolId,
} from 'hooks/useTokenInfo'
import { RoundedPlus } from 'icons'
import { utils } from 'near-api-js'
import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import {
  convertDenomToMicroDenom,
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
  protectAgainstNaN,
} from 'util/conversion'
import { IconWrapper } from '../../../../components/IconWrapper'
import { useRemoveLiquidity } from '../../../../state/pool'
import { addLiquidityToPool, Pool } from '../../../../util/pool'
import { Divider } from '../Divider'
import { LiquidityInputSelector } from '../LiquidityInputSelector'
import { PercentageSelection } from '../PercentageSelection'
import { StateSwitchButtons } from '../StateSwitchButtons'
import { usePoolDialogController } from './usePoolDialogController'

type ManagePoolDialogProps = {
  isShowing: boolean
  onRequestClose: () => void
  poolInfo: PoolDataType
}

type PoolDataType = {
  poolId: string
  reserve: [number, number]
  myReserve: [number, number]
  myLiquidity: {
    coins: number
    dollarValue: number
  }
  totalLiquidity: {
    coins: number
    dollarValue: number
  }
}

export const ManagePoolDialog = ({
  isShowing,
  onRequestClose,
  poolInfo,
}: ManagePoolDialogProps) => {
  // @ts-ignore
  const tokenInfo = useTokenInfoByPoolId(poolInfo.poolId)
  const [tokenABalance, setTokenABalance] = useState(0)
  const [tokenBBalance, setTokenBBalance] = useState(0)
  const [fee, setFee] = useState('0.30')
  const [slippage, setSlippage] = useState(0.5)

  const [isAddingLiquidity, setAddingLiquidity] = useState(true)

  const [addLiquidityAmounts, setAddLiquidityAmounts] = useState([0, 0])
  const [isLoading, setIsLoading] = useState(false)
  const [removeLiquidityAmount, setRemoveLiquidityAmount] = useState(0)
  const [poolList] = usePoolList()
  const poolById = poolList?.find((p) => p?.pool_id === Number(poolInfo.poolId))
  const tokenA = unsafelyGetTokenInfoFromAddress(poolById?.token_address[0])
  const tokenB = unsafelyGetTokenInfoFromAddress(poolById?.token_address[1])

  useEffect(() => {
    getTokenBalance(tokenA).then((bal) => {
      setTokenABalance(bal)
    })
    getTokenBalance(tokenB).then((bal) => {
      setTokenBBalance(bal)
    })
  }, [tokenA, tokenB])

  const {
    state: { maxApplicableBalanceForTokenA, maxApplicableBalanceForTokenB },
  } = usePoolDialogController({
    tokenA,
    tokenB,
    tokenABalance: tokenABalance,
    tokenBBalance: tokenBBalance,
    reserve: poolInfo.reserve,
    myReserve: poolInfo.myReserve,
    myLiquidity: poolInfo.myLiquidity,
  })

  const canManageLiquidity = poolInfo.reserve[0] > 0

  const submitAddLiquidity = () => {
    const id = Number(poolInfo.poolId)
    const tokenAmounts = []
    tokenAmounts.push({
      amount: addLiquidityAmounts[0].toString(),
      token: {
        decimals: tokenA.decimals,
        icon: tokenA.logoURI,
        id: tokenA.token_address,
        name: tokenA.name,
        Symbol: tokenA.symbol,
      },
    })
    tokenAmounts.push({
      amount: addLiquidityAmounts[1].toString(),
      token: {
        decimals: tokenB.decimals,
        icon: tokenB.logoURI,
        id: tokenB.token_address,
        name: tokenB.name,
        Symbol: tokenB.symbol,
      },
    })
    setIsLoading(true)
    addLiquidityToPool({ id, tokenAmounts })
  }

  const submitRemoveLiquidity = () => {
    const shares = protectAgainstNaN(
      (removeLiquidityAmount * poolInfo.totalLiquidity.coins) /
        poolInfo.totalLiquidity.dollarValue
    )
    const totalInMicro = utils.format.parseNearAmount(
      poolInfo.totalLiquidity.coins.toString()
    )
    const sharesInMicro = utils.format.parseNearAmount(shares.toString())
    let reserveA
    let reserveB
    if (tokenA.decimals === 24)
      reserveA = utils.format.parseNearAmount(poolInfo.reserve[0].toString())
    else
      reserveA = convertDenomToMicroDenom(poolInfo.reserve[0], tokenA.decimals)
    if (tokenB.decimals === 24)
      reserveB = utils.format.parseNearAmount(poolInfo.reserve[1].toString())
    else
      reserveB = convertDenomToMicroDenom(poolInfo.reserve[1], tokenB.decimals)
    const pool: Pool = {
      id: Number(poolInfo.poolId),
      shareSupply: totalInMicro.toString(),
      supplies: {
        [tokenA.token_address]: reserveA,
        [tokenB.token_address]: reserveB,
      },
      fee: poolById.fee,
      tvl: poolInfo.totalLiquidity.dollarValue,
      token0_ref_price: undefined,
      tokenIds: [tokenA.token_address, tokenB.token_address],
    }

    const { minimumAmounts, removeLiquidity } = useRemoveLiquidity({
      pool,
      slippageTolerance: slippage,
      shares: sharesInMicro.toString(),
    })

    setIsLoading(true)
    removeLiquidity()
  }

  return (
    <ChakraProvider>
      <Dialog
        isShowing={isShowing}
        onRequestClose={onRequestClose}
        kind="blank"
      >
        <StyledCloseIcon onClick={onRequestClose} offset={19} size="16px" />

        <StyledDivForContent>
          <Text
            variant="header"
            css={{ paddingBottom: canManageLiquidity ? '$8' : '$12' }}
          >
            Manage liquidity
          </Text>
        </StyledDivForContent>

        {canManageLiquidity && (
          <>
            <HStack justifyContent="center">
              <StateSwitchButtons
                activeValue={isAddingLiquidity ? 'add' : 'remove'}
                values={['add', 'remove']}
                onStateChange={(value) => {
                  setAddingLiquidity(value === 'add')
                }}
              />
            </HStack>
            <Divider offsetY={16} />
          </>
        )}
        <Stack padding="0 36px">
          <Stack textAlign="left">
            <Text variant="body" css={{ paddingBottom: '$6' }}>
              Choose how much to {isAddingLiquidity ? 'add' : 'remove'}
            </Text>
          </Stack>
          <AddOrRemoveLiquidityWrapper>
            {isAddingLiquidity && (
              <AddLiquidityContent
                isLoading={false}
                tokenASymbol={tokenA?.symbol}
                tokenBSymbol={tokenB?.symbol}
                tokenABalance={tokenABalance}
                tokenBBalance={tokenBBalance}
                maxApplicableBalanceForTokenA={maxApplicableBalanceForTokenA}
                maxApplicableBalanceForTokenB={maxApplicableBalanceForTokenB}
                liquidityAmounts={addLiquidityAmounts}
                onChangeLiquidity={setAddLiquidityAmounts}
              />
            )}

            {!isAddingLiquidity && (
              <RemoveLiquidityContent
                tokenA={tokenA}
                tokenB={tokenB}
                tokenAReserve={poolInfo.myReserve[0]}
                tokenBReserve={poolInfo.myReserve[1]}
                liquidityAmount={removeLiquidityAmount}
                totalLiquidity={poolInfo.totalLiquidity}
                myLiquidity={poolInfo.myLiquidity}
                onChangeLiquidity={setRemoveLiquidityAmount}
              />
            )}
          </AddOrRemoveLiquidityWrapper>
          <StyledDivForDivider>
            <Divider />
          </StyledDivForDivider>
          <StyledDivForContent>
            <StyledDivForFooter>
              <PrimaryButton onClick={onRequestClose}>Cancel</PrimaryButton>
              <SecondaryButton
                onClick={
                  isAddingLiquidity ? submitAddLiquidity : submitRemoveLiquidity
                }
                disabled={
                  (isAddingLiquidity &&
                    (!addLiquidityAmounts[0] || !addLiquidityAmounts[1])) ||
                  (!isAddingLiquidity && !removeLiquidityAmount)
                }
                loading={isLoading}
              >
                {isAddingLiquidity ? 'Add' : 'Remove'} liquidity
              </SecondaryButton>
            </StyledDivForFooter>
          </StyledDivForContent>
        </Stack>
      </Dialog>
    </ChakraProvider>
  )
}

function AddLiquidityContent({
  liquidityAmounts,
  tokenASymbol,
  tokenBSymbol,
  tokenABalance,
  tokenBBalance,
  maxApplicableBalanceForTokenA,
  maxApplicableBalanceForTokenB,
  isLoading,
  onChangeLiquidity,
}) {
  const handleTokenAAmountChange = (input: number) => {
    const value = Math.min(input, maxApplicableBalanceForTokenA)

    onChangeLiquidity([
      value,
      protectAgainstNaN(value / maxApplicableBalanceForTokenA) *
        maxApplicableBalanceForTokenB,
    ])
  }

  const handleTokenBAmountChange = (input: number) => {
    const value = Math.min(input, maxApplicableBalanceForTokenB)

    onChangeLiquidity([
      protectAgainstNaN(
        (value / maxApplicableBalanceForTokenB) * maxApplicableBalanceForTokenA
      ),
      value,
    ])
  }

  const handleApplyMaximumAmount = () => {
    handleTokenAAmountChange(maxApplicableBalanceForTokenA)
  }

  return (
    <Stack spacing={10} alignItems="center">
      <StyledDivForLiquidityInputs>
        <LiquidityInput
          tokenSymbol={tokenASymbol}
          availableAmount={tokenABalance ? tokenABalance : 0}
          maxApplicableAmount={maxApplicableBalanceForTokenA}
          amount={liquidityAmounts[0]}
          onAmountChange={handleTokenAAmountChange}
        />
        <LiquidityInput
          tokenSymbol={tokenBSymbol}
          availableAmount={tokenBBalance ? tokenBBalance : 0}
          maxApplicableAmount={maxApplicableBalanceForTokenB}
          amount={liquidityAmounts[1]}
          onAmountChange={handleTokenBAmountChange}
        />
      </StyledDivForLiquidityInputs>
      <MaxButton
        onClick={handleApplyMaximumAmount}
        leftIcon={<IconWrapper icon={<RoundedPlus />} />}
      >
        Provide max liquidity
      </MaxButton>
    </Stack>
  )
}

function RemoveLiquidityContent({
  tokenA,
  tokenB,
  tokenAReserve,
  tokenBReserve,
  liquidityAmount,
  onChangeLiquidity,
  totalLiquidity,
  myLiquidity,
}) {
  // Todo: implement token price calculate
  const [tokenPrice, setTokenPrice] = useState(0)
  const percentageInputRef = useRef<HTMLInputElement>()

  useEffect(() => {
    percentageInputRef.current?.focus()
    setTokenPrice(useNearDollarValue())
  }, [])

  const availableLiquidityDollarValue = myLiquidity.dollarValue

  // const liquidityToRemove = availableLiquidityDollarValue * liquidityPercentage

  const handleChangeLiquidity = (value) => {
    onChangeLiquidity(value)
  }

  return (
    <>
      <StyledDivForContent>
        <LiquidityInputSelector
          inputRef={percentageInputRef}
          maxLiquidity={availableLiquidityDollarValue}
          liquidity={liquidityAmount}
          onChangeLiquidity={handleChangeLiquidity}
        />
        <StyledGridForDollarValueTxInfo>
          <Text variant="caption" color="primary" css={{ padding: '$6 0 $9' }}>
            Available liquidity: $
            {dollarValueFormatterWithDecimals(availableLiquidityDollarValue, {
              includeCommaSeparation: true,
            })}
          </Text>
          <Text variant="caption" color="primary" css={{ padding: '$6 0 $9' }}>
            ≈ ${' '}
            {dollarValueFormatterWithDecimals(liquidityAmount, {
              includeCommaSeparation: true,
            })}
          </Text>
        </StyledGridForDollarValueTxInfo>
        <PercentageSelection
          maxLiquidity={availableLiquidityDollarValue}
          liquidity={liquidityAmount}
          onChangeLiquidity={handleChangeLiquidity}
        />
      </StyledDivForContent>
      <Divider offsetY={16} />
      <StyledDivForContent>
        <Text variant="body" css={{ paddingBottom: '$7' }}>
          Removing
        </Text>
        <StyledDivForLiquiditySummary>
          <StyledDivForToken>
            <StyledImageForTokenLogo src={tokenA?.logoURI} alt={tokenA?.name} />
            <Text variant="caption">
              {formatTokenBalance(
                (tokenAReserve * liquidityAmount) / myLiquidity.dollarValue
              )}{' '}
              {tokenA?.symbol}
            </Text>
          </StyledDivForToken>
          <StyledDivForToken>
            <StyledImageForTokenLogo src={tokenB.logoURI} alt={tokenB?.name} />
            <Text variant="caption">
              {formatTokenBalance(
                (tokenBReserve * liquidityAmount) / myLiquidity.dollarValue
              )}{' '}
              {tokenB.symbol}
            </Text>
          </StyledDivForToken>
        </StyledDivForLiquiditySummary>
      </StyledDivForContent>
    </>
  )
}

const PrimaryButton = styled(Button)`
  background: rgba(5, 6, 22, 0.2) !important;
  border-radius: 20px !important;
  border: 1px solid rgba(255, 255, 255, 0.06);
  height: 50px !important;
  width: 143px !important;
  color: white;
  font-size: 18px;
  font-weight: 600;
`
const SecondaryButton = styled(Button)`
  background: linear-gradient(
    94.95deg,
    #ffffff 7.64%,
    rgba(255, 255, 255, 0.2) 97.65%
  ) !important;
  box-shadow: 0px 10px 30px rgba(42, 47, 50, 0.2) !important;
  backdrop-filter: blur(14px);
  /* Note: backdrop-filter has minimal browser support */
  border: 1px solid white;
  border-radius: 20px !important;
  height: 50px !important;
  width: 143px !important;
  color: black;
`

const StyledDivForContent = styled.div``

const MaxButton = styled(Button)`
  background: #ffffff;
  border-radius: 16px !important;
  color: black !important;
  width: 346px !important;
  height: 54px !important;
  justify-content: center;
`

const StyledDivForLiquidityInputs = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 16px;
`

const StyledDivForFooter = styled.div`
  display: flex;
  justify-content: center;
  column-gap: 10px;
  padding: 10px 0 40px 0;
`

const StyledDivForDivider = styled.div`
  padding-top: 10px;
`

const StyledGridForDollarValueTxInfo = styled.div`
  display: flex;
  justify-content: space-between;
`

const StyledDivForLiquiditySummary = styled.div`
  display: flex;
  align-items: center;
  column-gap: 10px;
`

const StyledDivForToken = styled(StyledDivForLiquiditySummary)``

const StyledImageForTokenLogo = styled.img`
  width: 20px;
  height: 20px;
  border-radius: 50%;
`

const AddOrRemoveLiquidityWrapper = styled.div`
  background: rgba(5, 6, 22, 0.2);
  padding: 25px 30px;
  border-radius: 20px;
  backdrop-filter: blur(40px);
`
