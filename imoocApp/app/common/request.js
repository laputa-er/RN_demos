import queryString from 'query-string'
import _ from 'lodash'
import Mock from 'mockjs'
import config from './config'

export function get(url, params) {
	if (params) {
		url += '?' + queryString.stringify(params)
	}
	return fetch(url)
		.then(response => response.json())
		.then(response => Mock.mock(response))
}

export function post(url, body) {
	const options = _.extend(config.header, {
		body: JSON.stringify(body)
	})
	return fetch(url, options)
		.then(response => response.json())
		.then(response => Mock.mock(response))
}

