import styled from 'styled-components'

export const ContentWrapper = styled.div`
  overflow: auto;
  height: 450px;
  ::-webkit-scrollbar {
    width: 8px;
  }
  ::-webkit-scrollbar-thumb {
    background: black;
    border-radius: 8px;
  }
  ::-webkit-scrollbar-track {
    background: white;
  }
  padding: 0 10px;
  @media (max-width: 1550px) {
    height: 300px;
  }
`
export const Container = styled.div`
  padding: 60px;
  @media (max-width: 1550px) {
    padding: 30px;
  }
`
export const StyledWrapperForNavigation = styled.nav`
  display: flex;
  alignitems: center;
  margin-bottom: 40px;
  @media (max-width: 1550px) {
    margin-bottom: 20px;
  }
`
