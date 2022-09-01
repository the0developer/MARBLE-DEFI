import { IconWrapper } from '../../../components/IconWrapper'
import { Exchange } from '../../../icons/Exchange'
import { Text } from '../../../components/Text'
import React, { useState } from 'react'
import { styled } from 'components/theme'
import {
  dollarValueFormatterWithDecimals,
  formatTokenBalance,
  valueFormatter18,
  valueFormatter6,
} from '../../../util/conversion'
import { useRecoilValue } from 'recoil'
import { tokenSwapAtom } from '../swapAtoms'
// import { useTxRates } from '../hooks/useTxRates'

type TransactionTipsProps = {
  isPriceLoading?: boolean
  tokenToTokenPrice?: number
  onTokenSwaps: () => void
  disabled?: boolean
}

export const TransactionTips = ({
  isPriceLoading,
  tokenToTokenPrice,
  onTokenSwaps,
  disabled,
}: TransactionTipsProps) => {
  const [swappedPosition, setSwappedPositions] = useState(false)
  const [tokenA, tokenB] = useRecoilValue(tokenSwapAtom)

  // const { isShowing, conversionRate, conversionRateInDollar, dollarValue } =
  //   useTxRates({
  //     tokenASymbol: tokenA?.tokenSymbol,
  //     tokenBSymbol: tokenB?.tokenSymbol,
  //     tokenAAmount: tokenA?.amount,
  //     tokenToTokenPrice,
  //     isLoading: isPriceLoading,
  //   })
  return (
    <StyledDivForWrapper>
      <StyledDivForRateWrapper>
        <StyledIconWrapper
          type="button"
          size="40px"
          color="#FFFFFF"
          icon={<Exchange width="30px" />}
          flipped={swappedPosition}
          onClick={
            !disabled
              ? () => {
                  setSwappedPositions(!swappedPosition)
                  onTokenSwaps()
                }
              : undefined
          }
        />
      </StyledDivForRateWrapper>
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  textAlign: '-webkit-center',
  zIndex: '100',
  height: '20px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const StyledDivForRateWrapper = styled('div', {
  background: '#050616',
  backdropFilter: 'blur(40px)',
  borderRadius: '20px',
  transform: 'rotate(-45deg)',
  border: '1px solid rgba(255, 255, 255, 0.23)',
  width: '77px',
  height: '77px',
  zIndex: '10',
  display: 'flex',
  boxShadow:
    '0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px rgba(109, 109, 120, 0.47)',
  justifyContent: 'center',
  alignItems: 'center',
})

const StyledIconWrapper = styled(IconWrapper, {
  stroke: '#FFFFFF',
  transform: 'rotate(45deg)',
  width: '30px',
  variants: {
    flipped: {
      true: {
        transform: 'rotate(45deg)',
      },
      false: {
        transform: 'rotate(45deg)',
      },
    },
  },
})
