import { createStore, applyMiddleware } from 'redux'
import { fromJS } from 'immutable'
import thunk from 'redux-thunk'
// import createLogger from 'redux-logger'
import promiseMiddleware from 'redux-promise'
import reducers from './reducers'

// const logger = createLogger()

const middlewares = [
	thunk,// 让 action 可以返回函数，从而便于异步
	promiseMiddleware,// 让 store 的 dispatch 方法可以接受 Promise 对象作为参数
]

export default function configureStore(initialState = fromJS({})) {
	const enhancer = applyMiddleware(...middlewares)
	const store = createStore(reducers(), initialState, enhancer)

	// 热重载
	// RN 继承了 JS 的模块系统，引入了一个 hot 对象。通过该对象可以实现局部刷新，但不会丢失应用的状态。
	// 这个特性在 RN 中称为 MH2。这个特性是基于 webpack 来实现的，
	if (module.hot) {
		module.hot.accept(() => {
			store.replaceReducer(require('./reducers'.default))
		})
	}
	return store
}