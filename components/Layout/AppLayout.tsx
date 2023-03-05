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
import { convertMicroDenomToDenom } from 'util/conversion'
import { SecondGradientBackground } from 'styles/styles'
// import { useDb } from 'hooks/useDb'

const tagManagerArgs = {
  gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
}

//TagManager.initialize(tagManagerArgs)

export const AppLayout = ({
  footerBar = <FooterBar />,
  children,
  fullWidth = true,
}) => {
  const [deposits, setDeposits] = useState<TokenBalancesView>()
  FetchCoinInfo()
  useEffect(() => {
    const _tempaccount = localStorage.getItem('accountId')
    if (!_tempaccount || _tempaccount.endsWith('testnet')) {
      localStorage.clear()
      return
    }
    getTokenBalances().then((data) => {
      setDeposits(data)
    })
  }, [])
  // useDb()
  useEffect(() => {
    TagManager.initialize(tagManagerArgs)
  }, [])
  const getBadgeInfo = () => {
    const status = localStorage.getItem('accountId')
    return '123'
  }
  return (
    <ChakraProvider>
      <StyledWrapper>
        {isPC() ? <NavigationSidebar /> : <FixedNavigationSidebar />}

        <StyledContainer>{children}</StyledContainer>
      </StyledWrapper>
    </ChakraProvider>
  )
}

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
