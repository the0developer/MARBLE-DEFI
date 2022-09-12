import styled from 'styled-components'

export const ContentWrapper = styled.div`
  overflow: auto;
  height: 600px;
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
  padding: 0 10px;
  @media (max-width: 1550px) {
    height: 450px;
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
