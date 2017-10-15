import * as types from '../actions/actionTypes'

const initialState = {
  user: null,
  popup: null,
  welcomed: false,
  entered: false,
  booted: false,
  logined: false,
  sliderLoop: false,
  banners: [
    require('../static/images/s1.jpg'),
    require('../static/images/s2.jpg'),
    require('../static/images/s3.jpg')
  ]
}

export default (state = initialState, action) => {
  switch (action.type) {
  case types.SHOW_ALERT:
    return {
      ...state,
      popup: {
        title: action.payload.title,
        content: action.payload.content
      }
    }
  case types.HIDE_ALERT:
    return {
      ...state,
      popup: null
    }
  case types.APP_BOOTED:
    return {
      ...state,
      booted: true
    }
  case types.USER_LOGINED:
    return {
      ...state,
      user: action.payload.user,
      logined: true
    }
  case types.USER_UPDATED:
    return {
      ...state,
      user: action.payload.user,
      logined: true
    }
  case types.USER_LOGOUT:
    return {
      ...state,
      user: null,
      logined: false
    }

  case types.ENTER_SLIDE:
    return {
      ...state,
      entered: true
    }
  case types.WILL_ENTER_APP:
    let userData = action.payload.user
    let entered = action.payload.entered
    let newState = {
      booted: true
    }

    if (entered && entered[1] === 'yes') {
      newState.entered = true
    }

    if (userData && userData[1]) {
      let user = JSON.parse(userData[1])

      if (user && user.accessToken) {
        newState.logined = true
        newState.user = user
      }
    }

    return {
      ...state,
      ...newState
    }
  default:
    return state
  }
}
