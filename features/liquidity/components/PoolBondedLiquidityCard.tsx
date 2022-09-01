import { styled } from 'components/theme'
import { ChakraProvider, Text, Stack } from '@chakra-ui/react'
import { __POOL_REWARDS_ENABLED__ } from 'util/constants'
import { useTokenInfo } from 'hooks/useTokenInfo'
import { dollarValueFormatterWithDecimals } from '../../../util/conversion'

export const PoolBondedLiquidityCard = ({
  onButtonClick,
  tokenASymbol,
  tokenBSymbol,
  myLiquidity,
  totalLiquidity,
  stakedAmount,
}) => {
  const tokenA = useTokenInfo(tokenASymbol)
  const tokenB = useTokenInfo(tokenBSymbol)
  return (
    <StyledElementForCardLayout kind="wrapper">
      <StyledElementForCardLayout kind="content" name="liquidity">
        <Text fontSize="22px">Bonded liquidity</Text>
        <StyledStakedText>
          $
          {dollarValueFormatterWithDecimals(
            (Number(stakedAmount) / totalLiquidity?.coins) *
              totalLiquidity.dollarValue,
            {
              includeCommaSeparation: true,
              applyNumberConversion: false,
            }
          )}
        </StyledStakedText>
        <StyledUnstakedText>
          $
          {dollarValueFormatterWithDecimals(myLiquidity.dollarValue, {
            includeCommaSeparation: true,
            applyNumberConversion: false,
          })}{' '}
          unstaked tokens
        </StyledUnstakedText>
      </StyledElementForCardLayout>
      <StyledElementForCardLayout kind="borderContent">
        <Text fontSize="20px" fontWeight="500">
          Current reward incentive
        </Text>

        <StyledElementForTokens kind="wrapper">
          <StyledElementForTokens kind="column">
            <StyledImageForToken src={tokenA?.logoURI} />
          </StyledElementForTokens>
          <Text color="body" variant="caption">
            Unbonding Duration 14 days
          </Text>
        </StyledElementForTokens>
      </StyledElementForCardLayout>
      <StyledElementForCardLayout kind="content">
        <Button
          disabled={!__POOL_REWARDS_ENABLED__}
          onClick={__POOL_REWARDS_ENABLED__ ? onButtonClick : undefined}
        >
          {__POOL_REWARDS_ENABLED__ ? 'Bond / Unbond tokens' : 'Coming soon'}
        </Button>
      </StyledElementForCardLayout>
    </StyledElementForCardLayout>
  )
}

const StyledElementForCardLayout = styled('div', {
  variants: {
    kind: {
      wrapper: {
        borderRadius: '20px',
        padding: '17px 35px',
        backgroundColor: 'rgba(5,6,22,0.2)',
        boxShadow:
          '0px 4px 40px rgba(42, 47, 50, 0.09), inset 0px 7px 24px #6D6D78',
        backdropFilter: 'blur(40px)',
      },
      content: {
        flexDirection: 'row',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '17px 0',
      },
      borderContent: {
        border: '0.5px solid #FFCDCD',
        borderRadius: '26px',
        padding: '17px 35px',
        marginTop: '15px',
      },
    },
    name: {
      liquidity: {},
    },
  },
})

const StyledStakedText = styled('p', {
  fontSize: '30px',
  lineHeight: '$2',
  fontWeight: 600,
})
const StyledUnstakedText = styled('p', {
  position: 'absolute',
  right: '35px',
  top: '64px',
  paddingTop: '$2',
  fontSize: '18px',
  fontWeight: '500',
  color: '$textColors$secondary',
})
const Button = styled('button', {
  cursor: 'pointer',
  boxShadow: '0px 10px 30px rgba(42, 47, 50, 0.2)',
  background: 'white',
  color: 'black',
  padding: '13px 35px',
  borderRadius: '20px',
  fontSize: '18px',
  fontWeight: '600',
  textAlign: 'center',
  margin: '0 auto',
  variants: {
    disabled: {
      true: {
        background: 'gray',
        cursor: 'not-allowed',
      },
    },
  },
})
const StyledElementForTokens = styled('div', {
  display: 'flex',
  alignItems: 'center',

  variants: {
    kind: {
      wrapper: {
        paddingTop: '$8',
        columnGap: '$space$5',
      },
      column: {},
    },
  },
})

const StyledImageForToken = styled('img', {
  width: 20,
  height: 20,
  borderRadius: '50%',
  backgroundColor: '#ccc',
  boxShadow: '0 0 0 1px #e7d9e3',
  '&:not(&:first-of-type)': {
    marginLeft: -3,
  },
})
