import styled from 'styled-components'
import { NavigationSidebar } from './NavigationSidebar'
import FixedNavigationSidebar from './FixedNavigationSidebar'
import { FooterBar } from './FooterBar'
import { useEffect, useState } from 'react'
import TagManager from 'react-gtm-module'
import { ChakraProvider, HStack, Stack } from '@chakra-ui/react'
import { FetchCoinInfo } from 'hooks/useTokenBalance'
import { isPC } from 'util/device'
import { getTokenBalances, TokenBalancesView } from 'util/token'
import { Dialog, StyledCloseIcon } from 'components/Dialog'
import {
  convertMicroDenomToDenom,
  convertToFixedDecimals,
} from 'util/conversion'
import { getCurrentWallet } from 'util/sender-wallet'
import { SecondGradientBackground } from 'styles/styles'
// import { useDb } from 'hooks/useDb'
import {
  executeMultipleTransactions,
  Transaction,
  CONTRACT_NAME,
  ONE_YOCTO_NEAR,
} from 'util/near'
const tagManagerArgs = {
  gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
}

//TagManager.initialize(tagManagerArgs)
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
interface DepositedTokensInfo {
  token_address: string
  logoURI: string
  symbol: string
  amount: number
}

export const AppLayout = ({
  footerBar = <FooterBar />,
  children,
  fullWidth = true,
}) => {
  const { accountId } = getCurrentWallet()
  const [deposits, setDeposits] = useState<DepositedTokensInfo[]>([])
  const [isShowing, setIsShowing] = useState(false)
  const [showAnnouncement, setShowAnnouncement] = useState(false)
  FetchCoinInfo()
  useEffect(() => {
    const _tempaccount = localStorage.getItem('accountId')
    if (!_tempaccount || _tempaccount.endsWith('testnet')) {
      localStorage.clear()
      return
    }
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
  }, [accountId])
  useEffect(() => {
    if (!deposits) return
    Object.values(deposits).forEach((_deposit) => {
      if (_deposit.amount > 0.01) setIsShowing(true)
    })
  }, [deposits])

  // useDb()
  useEffect(() => {
    TagManager.initialize(tagManagerArgs)
  }, [])
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
  const onRequestOpen = () => {
    setIsShowing(true)
  }
  const onRequestClose = () => {
    setIsShowing(false)
  }
  return (
    <ChakraProvider>
      <StyledWrapper>
        {isShowing && (
          <AnnouncementBar>
            <h1>You have some tokens left to withdraw</h1>
            <WithdrawButton onClick={onRequestOpen}>Withdraw</WithdrawButton>
          </AnnouncementBar>
        )}
        {isPC() ? <NavigationSidebar /> : <FixedNavigationSidebar />}
        <StyledContainer>{children}</StyledContainer>
      </StyledWrapper>
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
    </ChakraProvider>
  )
}

const AnnouncementBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 40px;
  background: linear-gradient(45deg, #eb5d47 0%, #a933b2 50%, #a4f9ff 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  h1 {
    font-family: Mulish;
  }
`

const StyledWrapper = styled.div`
  display: flex;
  column-gap: 20px;
  /* background-image: url('/images/background.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover; */
  background: rgb(24, 27, 42);
  position: relative;
  color: white;
  padding: 90px;
  min-height: 100vh;

  * {
    font-family: Trajan;
  }
  @media (max-width: 1550px) {
    padding: 90px;
  }
  @media (max-width: 1024px) {
    padding-top: 100px;
  }
  @media (max-width: 650px) {
    padding: 80px 10px;
  }
`

const StyledContainer = styled(SecondGradientBackground)`
  &:before {
    border-radius: 30px;
  }
  width: 100%;
  @media (max-width: 1024px) {
    margin-inline: 0 !important;
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

const RefundButton = styled.div`
  cursor: pointer;
  box-shadow: 0px 10px 30px rgba(42, 47, 50, 0.2) !important;
  backdrop-filter: blur(14px);
  /* Note: backdrop-filter has minimal browser support */
  border-radius: 20px !important;
  color: black;
  font-size: 14px !important;
  background: white;
  width: fit-content;
  padding: 10px 20px;
`
const WithdrawButton = styled.div`
  padding: 5px 20px;
  border-radius: 8px;
  cursor: pointer;
  background: white;
  color: black;
  font-family: Mulish;
  font-size: 12px;
  margin: 0 20px;
`
