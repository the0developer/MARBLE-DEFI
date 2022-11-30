import React from 'react'
import { AppLayout } from '../components/Layout/AppLayout'
import { Dashboard } from '../features/dashboard'
import styled from 'styled-components'

export default function Home() {
  return (
    <AppLayout fullWidth={true}>
      <Container>
        <Header>
          <h1>Dashboard</h1>
        </Header>
        <StyledDivForWrapper>
          <Dashboard />
        </StyledDivForWrapper>
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
  position: relative;
  height: 100%;
`
const StyledDivForWrapper = styled.div`
  overflow: auto;
  position: absolute;
  right: 20px;
  left: 20px;
  bottom: 20px;
  top: 100px;
  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-thumb {
    background: white;
    border-radius: 8px;
  }
  ::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
  }
  @media (max-width: 1550px) {
    top: 60px;
  }
  @media (max-width: 650px) {
    right: 0;
    left: 0;
    bottom: 10px;
  }
  padding: 0 10px;
`
