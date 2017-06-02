export default {
	header: {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	},
	api: {
		// base: 'http://rapapi.org/mockjs/18917/',
		base: 'http://localhost:1234/',
		creations: 'api/creations',
		up: 'api/up',
		comment: 'api/comments',
		signup: 'api/u/signup',
		verify: 'api/u/verify',
		signature: 'api/signature',
		update: 'api/u/update'
	}
}