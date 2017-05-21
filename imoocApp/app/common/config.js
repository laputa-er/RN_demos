export default {
	header: {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	},
	api: {
		base: 'http://rapapi.org/mockjs/18917/',
		creations: 'api/creations',
		up: 'api/up',
		comment: 'api/comments',
		signup: 'api/u/signup',
		verify: 'api/u/verify'
	}
}