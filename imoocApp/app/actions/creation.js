import config from '../common/config'
import request from '../common/request'
import * as types from './actionTypes'

export const popAlert = (title, content) => dispatch => {
  dispatch({
    type: types.SHOW_ALERT,
    payload: {
      title: title,
      content: content
    }
  })

  setTimeout(function () {
    dispatch({
      type: types.HIDE_ALERT
    })
  }, 1500)
}

export const fetchCreations = (feed) => (dispatch, getState) => {
  let url = config.api.creations
  let isLoadingTail = false
  let isRefreshing = false
  let creation
  let cid = ''

  const {
    videoList
  } = getState().get('creations')

  const {
    user
  } = getState().get('app')

  if (feed === 'recent') {
    isRefreshing = true
    creation = videoList[0]
  }
  else {
    isLoadingTail = true
    creation = videoList[videoList.length - 1]
  }

  if (creation && creation._id) {
    cid = creation._id
  }

  dispatch({
    type: types.FETCH_CREATIONS_START,
    payload: {
      isLoadingTail: isLoadingTail,
      isRefreshing: isRefreshing
    }
  })

  request.get(url, {
    accessToken: 'user.accessToken',
    feed: feed,
    cid: cid
  })
    .then((data) => {
      if (data && data.success) {
        if (data.data.length > 0) {
          data.data.map(function (item) {
            const votes = item.votes || []

            if (user && votes.indexOf(user._id) > -1) {
              item.voted = true
            }
            else {
              item.voted = false
            }

            return item
          })

          let newVideoList

          if (feed === 'recent') {
            newVideoList = data.data.concat(videoList)
          }
          else {
            newVideoList = videoList.concat(data.data)
          }

          dispatch({
            type: types.FETCH_CREATIONS_FULLFILLED,
            payload: {
              videoList: newVideoList,
              videoTotal: data.total,
              isLoadingTail: false,
              isRefreshing: false
            }
          })
        }
        else {
          dispatch({
            type: types.FETCH_CREATIONS_REJECTED,
            payload: {
              isLoadingTail: false,
              isRefreshing: false
            }
          })
        }
      }
    })
    .catch(err => {
      dispatch({
        type: types.FETCH_CREATIONS_REJECTED,
        payload: {
          err: err,
          isLoadingTail: false,
          isRefreshing: false
        }
      })
    })
}