import { styled } from 'components/theme'
import { Text } from '../../../components/Text'
import { Button } from '../../../components/Button'
import { useNearDollarValue } from 'hooks/useTokenDollarValue'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { slippageAtom, tokenSwapAtom } from '../swapAtoms'
import { useConnectWallet } from '../../../hooks/useConnectWallet'
import { Spinner } from '../../../components/Spinner'
import { SlippageSelector } from './SlippageSelector'
import { NETWORK_FEE } from '../../../util/constants'
import { Exchange } from '../../../icons'
import { IconWrapper } from '../../../components/IconWrapper'
import { TokenInfo } from 'hooks/useTokenList'
import { useSwap } from 'state/swap'
import { WalletStatusType } from '../../../state/atoms/walletAtoms'

type TransactionTipsProps = {
  isPriceLoading?: boolean
  tokenToTokenPrice?: number
  tokenIn: TokenInfo
  tokenOut: TokenInfo
  tokenInAmount: number
  balance: number
  tokenA: any
  tokenB: any
  tokenValues: any
  setAmountOut?: (amount: string) => void
}

enum SWAP_MODE {
  NORMAL = 'normal',
  STABLE = 'stable',
}

export const TransactionAction = ({
  isPriceLoading,
  tokenToTokenPrice,
  tokenIn,
  tokenOut,
  tokenInAmount,
  balance,
  setAmountOut,
  tokenA,
  tokenB,
  tokenValues,
}: TransactionTipsProps) => {
  const [loadingData, setLoadingData] = useState(false)
  const [loadingTrigger, setLoadingTrigger] = useState(false)
  const [loadingPause, setLoadingPause] = useState<boolean>(false)
  const [reEstimateTrigger, setReEstimateTrigger] = useState(false)
  const [supportLedger, setSupportLedger] = useState(true)
  const [swapLoading, setSwapLoading] = useState(false)
  const NearValue = useNearDollarValue()
  const status = localStorage.getItem('accountId')
    ? WalletStatusType.connected
    : WalletStatusType.idle
  const { connectWallet } = useConnectWallet()

  /* wallet state */
  const [slippage, setSlippage] = useRecoilState(slippageAtom)

  const {
    canSwap,
    tokenOutAmount,
    minAmountOut,
    pools,
    swapError,
    makeSwap,
    avgFee,
    isParallelSwap,
    swapsToDo,
    setCanSwap,
  } = useSwap({
    tokenIn: tokenIn,
    tokenInAmount: tokenInAmount?.toString(),
    tokenOut: tokenOut,
    // @ts-ignore
    slippageTolerance: slippage,
    setLoadingData,
    loadingTrigger,
    setLoadingTrigger,
    loadingData,
    loadingPause,
    swapMode: SWAP_MODE.NORMAL,
    reEstimateTrigger,
    supportLedger,
  })
  console.log(
    'amount: ',
    tokenValues[tokenA.tokenAddress],
    tokenValues[tokenB.tokenAddress]
  )
  useEffect(() => {
    if (setAmountOut) setAmountOut(minAmountOut)
  }, [minAmountOut])

  const handleSubmit = () => {
    makeSwap(true)
  }
  const rate =
    tokenValues[tokenA.tokenAddress] / tokenValues[tokenB.tokenAddress]
  return (
    <StyledDivForWrapper>
      <StyledDivForInfo>
        <StyledDivColumnForInfo className="fee-selector" kind="slippage">
          <SlippageSelector
            // @ts-ignore
            slippage={slippage}
            onSlippageChange={setSlippage}
          />
        </StyledDivColumnForInfo>
        <StyledDivColumnForInfo className="fee-selector" kind="slippage">
          {tokenB.tokenAddress && (
            <TokenRateWrapper>
              {`1${tokenA.tokenSymbol} = ${rate.toFixed(4)}${
                tokenB.tokenSymbol
              } = $${NearValue * tokenValues[tokenA.tokenAddress]}`}
            </TokenRateWrapper>
          )}
        </StyledDivColumnForInfo>
        <StyledDivColumnForInfo className="fee-selector" kind="fees">
          <Text variant="primary" css={{ fontWeight: '$bold' }} color="primary">
            Swap fee ({NETWORK_FEE * 100}%)
          </Text>
        </StyledDivColumnForInfo>
      </StyledDivForInfo>
      {status === WalletStatusType.connected ? (
        <Button
          className="btn-swap btn-default"
          css={{
            background: '#FFFFFF',
            color: 'black',
            stroke: '$black',
            borderRadius: '60px',
            padding: '20px 40px',
            boxShadow: '0px 4px 40px rgba(42, 47, 50, 0.09)',
          }}
          iconLeft={<IconWrapper icon={<Exchange />} />}
          variant="primary"
          size="large"
          disabled={loadingTrigger || !canSwap}
          onClick={
            !loadingTrigger && !isPriceLoading ? handleSubmit : undefined
          }
        >
          {loadingData ? <Spinner instant /> : 'Swap'}
        </Button>
      ) : (
        <ButtonWrapper className="btn-swap btn-default">
          <PrimaryButton onClick={connectWallet}>Connect Wallet</PrimaryButton>
        </ButtonWrapper>
      )}
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  alignItems: 'center',
  padding: '0 0',
  marginTop: '20px',
})

const StyledDivForInfo = styled('div', {
  display: 'flex',
  alignItems: 'center',
  textTransform: 'uppercase',
  borderRadius: '20px',
  backgroundColor: 'rgba(5,6,22,0.6)',
  padding: '5px 5px',
  boxShadow: '0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6D6D78',
  justifyContent: 'space-between',
  backdropFilter: 'blur(40px)',
})

const StyledDivColumnForInfo = styled('div', {
  display: 'grid',
  variants: {
    kind: {
      slippage: {
        minWidth: '240px',
        borderRadius: '0px',
      },
      fees: {
        padding: '16px 25px',
        borderRadius: '0px',
      },
    },
  },
})

const ButtonWrapper = styled('div', {
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
})

const PrimaryButton = styled(Button, {
  position: 'relative',
  cursor: 'pointer',
  display: 'flex',
  boxShadow: '0px 10px 30px rgba(42, 47, 50, 0.2)',
  width: '176px',
  height: '52px',
  alignItems: 'center',
  borderRadius: '20px',
  textAlign: 'center',
  fontSize: '18px',
  fontWeight: '600',
  justifyContent: 'center',
  backdropFilter: 'blur(14px)',
  background: 'white',
  color: 'black',
})

const TokenRateWrapper = styled('div', {
  padding: '0 80px',
  borderRight: '1px solid black',
  fontSize: '24px',
  height: '52px',
  alignItems: 'center',
  display: 'flex',
})
