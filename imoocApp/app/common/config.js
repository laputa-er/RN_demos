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
    mock: 'http://rapapi.org/mockjs/18917/',
    base: 'http://127.0.0.1:1234/',
    creations: 'api/creations',
    up: 'api/up',
    comment: 'api/comments',
    signup: 'api/u/signup',
    verify: 'api/u/verify',
    signature: 'api/signature',
    update: 'api/u/update',
    video: 'api/creations/video',
    audio: 'api/creations/audio'
  }
}