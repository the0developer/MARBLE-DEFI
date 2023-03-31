import { Button, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react'
import { CSS } from '@stitches/react'
import { ArrowDown } from 'icons'
import { useEffect, useState } from 'react'
import styled from 'styled-components'
import { getTokenBalance } from '../hooks/useTokenBalance'
import { useBaseTokenInfo } from '../hooks/useTokenInfo'
import { formatTokenBalance } from '../util/conversion'
import { Text } from './Text'

type ConnectedWalletButtonProps = { css?: CSS } & {
  walletName?: string
  onConnect: () => void
  onDisconnect: () => void
  connected: boolean
}

export const ConnectedWalletButton = ({
  onConnect,
  connected,
  onDisconnect,
  walletName,
}: ConnectedWalletButtonProps) => {
  const baseToken = useBaseTokenInfo()
  const [balance, setBalance] = useState(0)
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
          <MenuItem css={menuItemCss} onClick={onDisconnect}>
            Disconnect
          </MenuItem>
        </MenuList>
      </Menu>
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
