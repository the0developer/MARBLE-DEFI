import styled from 'styled-components'

export const ContentWrapper = styled.div`
  overflow: auto;
  position: absolute;
  right: 20px;
  left: 20px;
  bottom: 20px;
  top: 140px;
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
    top: 80px;
  }
  @media (max-width: 1024px) {
    right: 0;
    left: 0;
    position: relative;
    top: 0;
    ::-webkit-scrollbar {
      width: 0px;
    }
  }
`
export const Container = styled.div`
  padding: 60px;
  position: relative;
  height: 100%;
  @media (max-width: 1550px) {
    padding: 30px;
  }
  @media (max-width: 650px) {
    padding: 5px;
  }
`
export const StyledWrapperForNavigation = styled.nav`
  display: flex;
  align-items: center;
  margin-bottom: 40px;
  @media (max-width: 1550px) {
    margin-bottom: 20px;
  }
`
