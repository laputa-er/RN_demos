import * as types from './actionTypes'
import { AsyncStorage } from 'react-native'
export const appBooted = () => {
	return {
		type: 'APP_BOOTED'
	}
}

export const enterdSlide = () => (dispatch, getState) => {
	AsyncStorage
		.setItem('entered', 'yes')
		.then(() => {
			dispatch({
				type: 'ENTER_SLIDE'
			})
		})
}

export const willEnterApp = () => {
  return (dispatch, getState) => {
    AsyncStorage
      .multiGet(['user', 'entered'])
      .then((data) => {
        let user = data[0]
        let entered = data[1]

        dispatch({
          type: types.WILL_ENTER_APP,
          payload: {
            user: user,
            entered: entered
          }
        })
      })
  }
}
