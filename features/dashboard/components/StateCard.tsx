import styled from 'styled-components'

const StyledCard = ({ icon, color, title, value }) => {
  return (
    <Container>
      <IconWrapper color={color}>{icon}</IconWrapper>
      <div>
        {title}
        {value}
      </div>
    </Container>
  )
}

const Container = styled.div`
  border-radius: 20px;
  background: rgba(5, 6, 22, 0.2);
  padding: 14px;
  display: flex;
  box-shadow: 0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6d6d78;
  backdrop-filter: blur(40px);

  @media (max-width: 1550px) {
    padding: 10px;
  }
`

const IconWrapper = styled.div<{ color: string }>`
  border-radius: 20px;
  width: 60px;
  height: 72px;
  background: ${({ color }) => color};
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  @media (max-width: 1550px) {
    width: 48px;
    height: 60px;
  }
`
export default StyledCard
