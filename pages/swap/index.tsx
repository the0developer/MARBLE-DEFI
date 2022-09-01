import React from 'react'
import { AppLayout } from 'components/Layout/AppLayout'
import { TokenSwap } from 'features/swap'
import { PageHeader } from 'components/Layout/PageHeader'
import styled from 'styled-components'

const Swap = () => {
  const [fullWidth, setFullWidth] = React.useState(true)
  return (
    <AppLayout fullWidth={fullWidth}>
      <Container>
        <Header>
          <h1>Swap</h1>
          <p>Swap between your favorite assets on Marble</p>
        </Header>
        <TokenSwap />
      </Container>
    </AppLayout>
  )
}
export default Swap
const Container = styled.div`
  padding: 60px 60px 0px 60px;
  // height: 100%;
  @media (max-width: 1550px) {
    padding: 20px 40px 0px 40px;
  }
`
const Header = styled.div`
  text-align: center;
  h1 {
    font-size: 35px;
    font-weight: 700;
  }
  p {
    font-size: 18px;
    font-weight: 400;
  }
`
