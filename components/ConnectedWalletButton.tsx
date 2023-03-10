import React, { useState, useEffect } from 'react'
import { Text } from './Text'
import {
  useBaseTokenInfo,
  useTokenInfoFromAddress,
} from '../hooks/useTokenInfo'
import { getTokenBalance } from '../hooks/useTokenBalance'
import {
  convertMicroDenomToDenom,
  formatTokenBalance,
  convertToFixedDecimals,
} from '../util/conversion'
import { getTokenBalances } from 'util/token'
import { CSS } from '@stitches/react'
import styled from 'styled-components'
import { Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react'
import { Dialog, StyledCloseIcon } from 'components/Dialog'
import { ArrowDown } from 'icons'
import {
  executeMultipleTransactions,
  Transaction,
  CONTRACT_NAME,
  ONE_YOCTO_NEAR,
} from 'util/near'

type ConnectedWalletButtonProps = { css?: CSS } & {
  walletName?: string
  onConnect: () => void
  onDisconnect: () => void
  connected: boolean
}

interface DepositedTokensInfo {
  token_address: string
  logoURI: string
  symbol: string
  amount: number
}

const tokensInfo = {
  'wrap.near': {
    id: 'wnear',
    token_address: 'wrap.near',
    symbol: 'wNEAR',
    name: 'Wrapped Near',
    decimals: 24,
    logoURI: '/images/wnear.png',
    icon: '/images/wnear.png',
  },
  'artex.marbledao.near': {
    id: 'artex',
    token_address: 'artex.marbledao.near',
    symbol: 'ARTEX',
    name: 'ARTEX',
    decimals: 24,
    logoURI: '/images/artex.png',
    icon: '/images/artex.png',
  },
}

export const ConnectedWalletButton = ({
  onConnect,
  connected,
  onDisconnect,
  walletName,
}: ConnectedWalletButtonProps) => {
  const baseToken = useBaseTokenInfo()
  const [balance, setBalance] = useState(0)
  const [deposits, setDeposits] = useState<DepositedTokensInfo[]>([])
  const [isShowing, setIsShowing] = useState(false)
  useEffect(() => {
    if (!connected) return
    getTokenBalances().then((data) => {
      const tokenAddresses = Object.keys(data)
      const tokens = tokenAddresses.map((_tokenAddress) => {
        return {
          ...tokensInfo[_tokenAddress],
          amount: convertMicroDenomToDenom(
            data[_tokenAddress],
            tokensInfo[_tokenAddress].decimals
          ),
        }
      })
      setDeposits(tokens)
    })
  }, [connected])
  const menuButtonCss = {
    background:
      'linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.06) 100%) !important',
    border: '1px solid rgba(255,255,255,0.7)',
    borderRadius: '30px',
    padding: '30px',
    ' span': {
      fontFamily: 'Mulish',
    },
    '&:hover': {
      background: 'none',
    },
    '&:focus': {
      background: 'none',
    },
  }
  const menuListCss = {
    background: 'rgb(35,38,52)',
    border: '1px solid rgba(255,255,255,0.7)',
  }
  const menuItemCss = {
    fontFamily: 'Mulish',
    '&:hover': {
      background: 'none',
      opacity: '0.6',
    },
    '&:focus': {
      background: 'none',
    },
  }
  useEffect(() => {
    // setBalance(0)
    getTokenBalance(baseToken).then((balance) => {
      setBalance(balance)
    })
  }, [baseToken])

  if (!connected) {
    return (
      <ConnectWalletContainer onClick={onConnect}>
        <span>Connect Wallet</span>
      </ConnectWalletContainer>
    )
  }
  const onRequestOpen = () => {
    setIsShowing(true)
  }
  const onRequestClose = () => {
    setIsShowing(false)
  }
  const handleWithdraw = async () => {
    // const transactions: Transaction[] = []
    const transactions: Transaction[] = deposits.map((_deposit) => {
      const _transaction: Transaction = {
        receiverId: CONTRACT_NAME,
        functionCalls: [
          {
            methodName: 'withdraw',
            args: {
              token_id: _deposit.token_address,
              amount: '0',
            },
            gas: '300000000000000',
            amount: ONE_YOCTO_NEAR,
          },
        ],
      }
      return _transaction
    })
    executeMultipleTransactions(transactions)
  }
  return (
    <>
      <Menu>
        <MenuButton css={menuButtonCss} as={Button} rightIcon={<ArrowDown />}>
          <Text
            variant="link"
            css={{
              '-webkit-background-clip': 'text',
              color: '$white',
            }}
          >
            {walletName}
          </Text>
          <Text
            variant="legend"
            css={{
              '-webkit-background-clip': 'text',
              color: '$white',
            }}
          >
            {formatTokenBalance(balance, { includeCommaSeparation: true })}{' '}
            {baseToken?.symbol}
          </Text>
        </MenuButton>
        <MenuList css={menuListCss}>
          <MenuItem css={menuItemCss} onClick={onRequestOpen}>
            Your Account
          </MenuItem>
          <MenuItem css={menuItemCss} onClick={onDisconnect}>
            Disconnect
          </MenuItem>
        </MenuList>
      </Menu>
      <Dialog
        isShowing={isShowing}
        onRequestClose={onRequestClose}
        kind="blank"
      >
        <StyledCloseIcon onClick={onRequestClose} offset={19} size="40px" />
        <div>
          <Title>Unused Tokens</Title>
        </div>
        <StyledDivForContent>
          {deposits.map((_depositedToken, index) => (
            <UnusedTokenItem key={index}>
              <ImgDiv>
                <img src={_depositedToken.logoURI} alt="token" />
                {_depositedToken.symbol}
              </ImgDiv>
              <TokenValue>
                {convertToFixedDecimals(_depositedToken.amount)}
              </TokenValue>
            </UnusedTokenItem>
          ))}
          <RefundButton onClick={handleWithdraw}>Withdraw</RefundButton>
        </StyledDivForContent>
      </Dialog>
    </>
  )
}

const ConnectWalletContainer = styled.div`
  position: relative;
  cursor: pointer;
  display: flex;
  width: 176px;
  height: 52px;
  align-items: center;
  text-align: center;
  font-size: 18px;
  border: 1px solid #ffffff;
  box-shadow: inset 0px 4px 6px rgba(0, 0, 0, 0.25);
  filter: drop-shadow(0px 4px 18px rgba(0, 0, 0, 0.15));
  border-radius: 20px;
  font-weight: 600;
  flex-direction: column;
  justify-content: center;
  color: white;
  &:hover {
    opacity: 0.6;
  }
`
const Title = styled.div`
  font-size: 20px;
  font-family: Trajan;
  color: white;
`
const StyledDivForContent = styled.div`
  padding: 20px 0;
`
const UnusedTokenItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 20px;
  color: white;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: white;
  }
`
const ImgDiv = styled.div`
  display: flex;
  align-items: center;
  column-gap: 20px;
`
const TokenValue = styled.div``

const RefundButton = styled(Button)`
  box-shadow: 0px 10px 30px rgba(42, 47, 50, 0.2) !important;
  backdrop-filter: blur(14px);
  /* Note: backdrop-filter has minimal browser support */
  border-radius: 20px !important;
  height: 50px !important;
  width: 170px !important;
  color: black;
  font-size: 14px !important;
`
