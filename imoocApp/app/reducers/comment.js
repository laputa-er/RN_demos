import * as types from '../actions/actionTypes'

const initialState = {
  creationId: null,
  commentTotal: 0,
  commentList: [],
  isCommentLoadingTail: false,
  isCommentRefreshing: false,
  isSending: false
}

export default (state = initialState, action) => {
  switch (action.type) {
  case types.FETCH_COMMENTS_START:
    return {
      ...state,
      creationId: action.payload.creationId,
      isCommentLoadingTail: action.payload.isCommentLoadingTail,
      isCommentRefreshing: action.payload.isCommentRefreshing
    }
  case types.FETCH_COMMENTS_FULLFILLED:
    return {
      ...state,
      commentList: action.payload.commentList,
      commentTotal: action.payload.commentTotal,
      isCommentLoadingTail: action.payload.isCommentLoadingTail,
      isCommentRefreshing: action.payload.isCommentRefreshing
    }
  case types.FETCH_COMMENTS_REJECTED:
    return {
      ...state,
      err: action.payload.err,
      isCommentLoadingTail: action.payload.isCommentLoadingTail,
      isCommentRefreshing: action.payload.isCommentRefreshing
    }
  case types.SEND_COMMENTS_START:
    return {
      ...state,
      isSending: action.payload.isSending
    }
  case types.SEND_COMMENTS_FULLFILLED:
    return {
      ...state,
      commentList: action.payload.commentList,
      commentTotal: action.payload.commentTotal,
      isSending: action.payload.isSending
    }
  case types.SEND_COMMENTS_REJECTED:
    return {
      ...state,
      isSending: action.payload.isSending
    }
  default:
    return state
  }
}
