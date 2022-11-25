import styled from 'styled-components'
import { NavigationSidebar } from './NavigationSidebar'
import { FooterBar } from './FooterBar'
import { useEffect, useState } from 'react'
import TagManager from 'react-gtm-module'
import { ChakraProvider, HStack, Stack } from '@chakra-ui/react'
import { FetchCoinInfo } from 'hooks/useTokenBalance'
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
  FetchCoinInfo()
  // useDb()
  useEffect(() => {
    TagManager.initialize(tagManagerArgs)
  }, [])

  return (
    <ChakraProvider>
      <StyledWrapper spacing={10}>
        <NavigationSidebar />
        <StyledContainer>{children}</StyledContainer>
      </StyledWrapper>
    </ChakraProvider>
  )
}

const StyledWrapper = styled(HStack)`
  display: flex;
  background-image: url('/images/background.jpg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: relative;
  color: white;
  padding: 90px;
  @media (max-width: 1550px) {
    padding: 40px;
  }
`

const StyledContainer = styled(SecondGradientBackground)`
  &:before {
    border-radius: 30px;
  }
  width: 100%;
  height: calc(100vh - 180px);
  @media (max-width: 1550px) {
    height: calc(100vh - 80px);
  }
`
