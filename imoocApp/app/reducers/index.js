import { combineReducers } from 'redux-immutable'

import app from './app'
import creations from './creation'

const reducers = {
  app,
  creations
}

export default function createReducer () {
  return combineReducers(reducers)
}