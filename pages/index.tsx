import React from 'react'
import { AppLayout } from '../components/Layout/AppLayout'
import { Dashboard } from '../features/dashboard'
import styled from 'styled-components'

export default function Home() {
  const [fullWidth, setFullWidth] = React.useState(true)
  return (
    <AppLayout fullWidth={fullWidth}>
      <Container>
        <Header>
          <h1>Dashboard</h1>
        </Header>
        <Dashboard />
      </Container>
    </AppLayout>
  )
}

const Header = styled.div`
  text-align: center;
  h1 {
    font-size: 45px;
    font-weight: 700;
    font-family: Trajan;
    @media (max-width: 1550px) {
      font-size: 30px;
    }
  }
  p {
    font-size: 24px;
    font-weight: 400;
    font-family: Trajan;
    @media (max-width: 1550px) {
      font-size: 14px;
    }
  }
`
const Container = styled.div`
  padding: 20px 0;
`
