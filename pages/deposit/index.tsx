import { AppLayout } from 'components/Layout/AppLayout'
import { PageHeader } from 'components/Layout/PageHeader'
import { styled } from 'components/theme'
import { useEffect, useState } from 'react'
import { TokenSelector } from '../../features/swap/components/TokenSelector'
import { TransactionTips } from '../../features/swap/components/TransactionTips'
// import { useTokenToTokenPrice } from './hooks/useTokenToTokenPrice'
import { Button } from 'components/Button'
import { getTokenBalance } from 'hooks/useTokenBalance'
import { TokenInfo, useTokenList } from '../../hooks/useTokenList'
import { nearDeposit, nearWithdraw } from '../../util/wrap-near'

interface DepositToken {
  tokenInfo: TokenInfo
  balance: number
}

export default function Deposit() {
  /* connect to recoil */
  const [tokenList, isTokenListLoading] = useTokenList()
  const [tokenA, setTokenA] = useState<DepositToken>()
  const [tokenB, setTokenB] = useState<DepositToken>()
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [disabled, setDisable] = useState(true)

  useEffect(() => {
    /* fetch token list and set initial state */
    if (!isTokenListLoading && tokenList) {
      // eslint-disable-line react-hooks/rules-of-hooks
      getTokenBalance(tokenList.native_token).then((bal) =>
        setTokenA({ tokenInfo: tokenList.native_token, balance: bal })
      )
      // eslint-disable-line react-hooks/rules-of-hooks
      getTokenBalance(tokenList.wrap_token).then((bal) =>
        setTokenB({ tokenInfo: tokenList.wrap_token, balance: bal })
      )
    }
  }, [isTokenListLoading, tokenList])

  useEffect(() => {
    if (disabled && amount > 0) setDisable(false)
    if (!disabled && amount === 0) setDisable(true)
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [amount])

  const handleSwapTokenPositions = () => {
    const temp = tokenA
    setAmount(amount > tokenB.balance ? tokenB.balance : amount)
    setTokenA(tokenB)
    setTokenB(temp)
  }

  const onChangeToken = ([newA, newB]) => {
    // const amount = newA.amount > newA.balance ? newA.balance : newA.amount
    setAmount(newA.amount)
    if (newA.tokenSymbol !== tokenA.tokenInfo.symbol) {
      handleSwapTokenPositions()
    }
  }

  const onSubmit = () => {
    if (amount === 0) {
    }
    setLoading(true)
    if (tokenA.tokenInfo.symbol === 'NEAR')
      return nearDeposit(amount.toString())
    else return nearWithdraw(amount.toString())
  }
  return (
    <AppLayout fullWidth={true}>
      <Container className="middle mauto">
        <PageHeader
          title="NEAR - wNEAR"
          subtitle="Deposit NEAR or Withdraw from wNEAR"
        />
        <StyledDivForWrapper>
          <SelectorPart>
            <HeightFix>
              <TokenSelector
                tokenSymbol={tokenA?.tokenInfo.symbol}
                tokenAddress={tokenA?.tokenInfo.token_address}
                amount={amount}
                balance={tokenA?.balance}
                isDeposit={true}
                onChange={(updateTokenA) => {
                  onChangeToken([updateTokenA, tokenB])
                }}
              />
            </HeightFix>
            <TransactionTips onTokenSwaps={handleSwapTokenPositions} />
            <HeightFix>
              <TokenSelector
                readOnly
                tokenSymbol={tokenB?.tokenInfo.symbol}
                tokenAddress={tokenB?.tokenInfo.token_address}
                amount={amount}
                isDeposit={true}
                balance={tokenB?.balance}
                onChange={(updatedTokenB) => {
                  onChangeToken([tokenA, updatedTokenB])
                }}
              />
            </HeightFix>
          </SelectorPart>
          <ButtonWrapper>
            <PrimaryButton
              disabled={disabled}
              loading={loading}
              onClick={() => {
                if (disabled) return
                onSubmit()
              }}
            >
              Submit
            </PrimaryButton>
          </ButtonWrapper>
        </StyledDivForWrapper>
      </Container>
    </AppLayout>
  )
}

const StyledDivForWrapper = styled('div', {
  padding: '3rem 4rem',
})

const ButtonWrapper = styled('div', {
  paddingTop: '20px',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
})

const Container = styled('div', {})
const SelectorPart = styled('div', {
  position: 'relative',
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
const HeightFix = styled('div', {
  height: '115px',
  '@media (max-width: 1550px)': {
    height: '90px',
  },
})
