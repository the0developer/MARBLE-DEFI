import React, { ReactNode, useState } from 'react'
import styled from 'styled-components'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
const MENU_ENTRY_HEIGHT = 50

const Container = styled.div`
  display: flex;
  flex-direction: column;
  // Safari fix
  flex-shrink: 0;
`

const AccordionContent = styled.div<{ isOpen: boolean; maxHeight: number }>`
  max-height: ${({ isOpen, maxHeight }) => (isOpen ? `${maxHeight}px` : 0)};
  transition: max-height 0.3s ease-out;
  overflow: hidden;
  padding: 0 40px;
`

const Accordion = ({ label, icon, children, isActive }) => {
  const [isOpen, setIsOpen] = useState(false)
  const handleClick = () => {
    setIsOpen((prevState) => !prevState)
  }

  return (
    <Container>
      <MenuEntry onClick={handleClick} isActive={isActive}>
        {icon}&nbsp;&nbsp;
        {label}
        <IconWrapper>
          {isOpen ? (
            <ChevronUpIcon width="20px" height="20px" />
          ) : (
            <ChevronDownIcon />
          )}
        </IconWrapper>
      </MenuEntry>
      <AccordionContent
        isOpen={isOpen}
        maxHeight={React.Children.count(children) * (MENU_ENTRY_HEIGHT + 12)}
      >
        {children}
      </AccordionContent>
    </Container>
  )
}

const IconWrapper = styled.div`
  position: absolute;
  right: 0px;
  svg {
    width: 20px;
    height: 20px;
  }
`

export const MenuEntry = styled.div<{ isActive: boolean }>`
  cursor: pointer;
  display: flex;
  align-items: center;
  height: ${MENU_ENTRY_HEIGHT}px;
  width: 100%;
  font-size: 16px;
  font-weight: ${({ isActive }) => (isActive ? '700' : '400')};
  position: relative;
`

export default Accordion
