import * as types from '../actions/actionTypes'

const initialState = {
  videoTotal: 0,
  videoList: [],
  isLoadingTail: false,
  isRefreshing: false,
  popup: null
}

export default function (state = initialState, action) {
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
  case types.FETCH_CREATIONS_START:
    return {
      ...state,
      isLoadingTail: action.payload.isLoadingTail,
      isRefreshing: action.payload.isRefreshing
    }
  case types.FETCH_CREATIONS_FULLFILLED:
    return {
      ...state,
      videoList: action.payload.videoList,
      videoTotal: action.payload.videoTotal,
      isLoadingTail: action.payload.isLoadingTail,
      isRefreshing: action.payload.isRefreshing
    }
  case types.FETCH_CREATIONS_REJECTED:
    return {
      ...state,
      err: action.payload.err,
      isLoadingTail: action.payload.isLoadingTail,
      isRefreshing: action.payload.isRefreshing
    }
  default:
    return state
  }
}
