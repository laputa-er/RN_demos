const baseUrl = 'http://127.0.0.1:1234/'

export default {
  header: {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  },
  backup: {
    avatar: 'http://org5v1bbt.bkt.clouddn.com/dog.jpg'
  },
  qiniu: {
    upload: 'http://up-z1.qiniu.com',
    video: 'http://org5nla9w.bkt.clouddn.com/',
    thumb: 'http://org5nla9w.bkt.clouddn.com/',
    avatar: 'http://org5v1bbt.bkt.clouddn.com/'
  },
  cloudinary: {
    cloud_name: 'dox3udxny',
    api_key: '933482656862456',
    base: 'http://res.cloudinary.com/dox3udxny',
    image: 'https://api.cloudinary.com/v1_1/dox3udxny/image/upload',
    video: 'https://api.cloudinary.com/v1_1/dox3udxny/video/upload',
    audio: 'https://api.cloudinary.com/v1_1/dox3udxny/raw/upload'
  },
  api: {
    creations: baseUrl + 'api/creations',
    up: baseUrl + 'api/up',
    comment: baseUrl + 'api/comments',
    signup: baseUrl + 'api/u/signup',
    verify: baseUrl + 'api/u/verify',
    signature: baseUrl + 'api/signature',
    update: baseUrl + 'api/u/update',
    video: baseUrl + 'api/creations/video',
    audio: baseUrl + 'api/creations/audio'
  }
}