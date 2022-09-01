import React from 'react'
import styled from 'styled-components'
import { Button } from 'components/Button'
import { useBaseTokenInfo } from 'hooks/useTokenInfo'

type ConvenienceBalanceButtonsProps = {
  disabled?: boolean
  tokenSymbol: string
  availableAmount: number
  onChange: (amount: number) => void
}

export const ConvenienceBalanceButtons = ({
  tokenSymbol,
  availableAmount,
  disabled,
  onChange,
}: ConvenienceBalanceButtonsProps) => {
  const baseToken = useBaseTokenInfo()
  return (
    !disabled && (
      <>
        <StyledButton
          variant="secondary"
          className="mini-hidden"
          onClick={() => {
            let amount =
              tokenSymbol === 'JUNO' ? availableAmount - 0.025 : availableAmount
            onChange(amount)
          }}
        >
          Max
        </StyledButton>
        <StyledButton
          className="small-hidden"
          variant="secondary"
          onClick={() => onChange(availableAmount / 2)}
        >
          1/2
        </StyledButton>
      </>
    )
  )
}

const StyledButton = styled(Button)`
  margin: 0 6px;
  background: radial-gradient(
    0.17% 59.87% at 50.17% 40.13%,
    rgba(255, 255, 255, 0) 0%,
    rgba(236, 246, 255, 0.0858) 100%
  );
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.8);
`
