import { combineReducers } from 'redux-immutable'

import app from './app'
import creations from './creation'
import comments from './comment'

const reducers = {
  app,
  creations,
  comments
}

export default function createReducer () {
  return combineReducers(reducers)
}