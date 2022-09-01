import { styled } from 'components/theme'
import { SecondaryButton } from './SecondaryButton'

type PercentageSelectionProps = {
  maxLiquidity: number
  liquidity: number
  onChangeLiquidity: (liquidity: number) => void
}

export const PercentageSelection = ({
  liquidity,
  onChangeLiquidity,
  maxLiquidity,
}: PercentageSelectionProps): JSX.Element => {
  const valuesForSteps = [0.1, 0.25, 0.5, 0.75, 1]
  const percentage = liquidity / maxLiquidity
  return (
    <StyledDivForGrid>
      {valuesForSteps.map((valueForStep) => {
        return (
          <SecondaryButton
            size="small"
            active={Number(percentage.toFixed(4)) === valueForStep}
            key={valueForStep}
            onClick={() => {
              onChangeLiquidity(valueForStep * maxLiquidity)
            }}
            color="black"
          >
            {valueForStep * 100}%
          </SecondaryButton>
        )
      })}
    </StyledDivForGrid>
  )
}

const StyledDivForGrid = styled('div', {
  display: 'grid',
  color: 'black',
  gridTemplateColumns: '1fr 1fr 1fr 1fr 1fr',
  width: '100%',
})
