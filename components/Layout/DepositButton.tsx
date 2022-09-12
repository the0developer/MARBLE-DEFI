import styled from 'styled-components'
import { useRouter } from 'next/router'

export const DepositButton = () => {
  const router = useRouter()

  const gotoDeposit = () => {
    router.push('/deposit')
  }

  return (
    <DepositButtonWrapper onClick={() => gotoDeposit()}>
      <StyledImageForLogoText
        className="logo-img"
        src="/images/wnear-near.svg"
      />
    </DepositButtonWrapper>
  )
}

const StyledImageForLogoText = styled.img``

const DepositButtonWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  margin: 20px;
`
