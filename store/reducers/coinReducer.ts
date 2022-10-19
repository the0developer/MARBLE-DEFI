import { NEAR_STATUS, DUST_STATUS } from '../types'

const initialState = {
  near_value: 0,
  dust_value: 0,
}

const coinReducer = (state = initialState, action) => {
  switch (action.type) {
    case NEAR_STATUS:
      return {
        ...state,
        near_value: action.payload,
      }
    case DUST_STATUS:
      return {
        ...state,
        dust_value: action.payload * state.near_value,
      }
    default:
      return state
  }
}

export default coinReducer
