import styled from 'styled-components'
import { NavigationSidebar } from './NavigationSidebar'
import { FooterBar } from './FooterBar'
import { useEffect, useState } from 'react'
import TagManager from 'react-gtm-module'
import { ChakraProvider, HStack, Stack } from '@chakra-ui/react'
const tagManagerArgs = {
  gtmId: process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID,
}

//TagManager.initialize(tagManagerArgs)

export const AppLayout = ({
  footerBar = <FooterBar />,
  children,
  fullWidth = true,
}) => {
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

const StyledContainer = styled.div`
  position: relative;
  width: 100%;
  height: calc(100vh - 180px);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: 0px 7px 14px rgba(0, 0, 0, 0.1),
    inset 0px 14px 24px rgba(17, 20, 29, 0.4);
  backdrop-filter: blur(30px);
  /* Note: backdrop-filter has minimal browser support */
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  @media (max-width: 1550px) {
    height: calc(100vh - 80px);
  }
`
