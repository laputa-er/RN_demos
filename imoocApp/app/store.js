import { createStore, applyMiddleware } from 'redux'
import { fromJS } from 'immutable'
import thunk from 'redux-thunk'
import promiseMiddleware from 'redux-promise'
import reducers from './reducers'

const middlewares = [
  thunk,// 让 action 可以返回函数，从而便于异步
  promiseMiddleware,// 让 store 的 dispatch 方法可以接受 Promise 对象作为参数
]

if (process.env.NODE_ENV === 'development') {
  // 调用日志打印方法 collapsed是让action折叠，看着舒服点
  const loggerMiddleware = require('redux-logger').createLogger({ collapsed: true })
  middlewares.push(loggerMiddleware)
}

export default function configureStore (initialState = fromJS({})) {
  let enhancer = applyMiddleware(...middlewares)
  if (process.env.NODE_ENV === 'development') {
    enhancer = require('redux-devtools-extension').composeWithDevTools(enhancer)
  }
  const store = createStore(reducers(), initialState, enhancer)

  // 热重载
  // RN 继承了 JS 的模块系统，引入了一个 hot 对象。通过该对象可以实现局部刷新，但不会丢失应用的状态。
  // 这个特性在 RN 中称为 MH2。这个特性是基于 webpack 来实现的，
  if (module.hot) {
    module.hot.accept(() => {
      store.replaceReducer(require('./reducers').default)
    })
  }
  return store
}