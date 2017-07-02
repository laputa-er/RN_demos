import config from './config'

export const thumb = function (key) {
	return key.includes('http') ? key : `${config.qiniu.thumb}${key}`
}
export const avatar = function (key) {
	if (!key) return config.backup.avatar
	if (key.includes('http')) return key
	if (key.includes('data:image')) return key
	if (key.incldeus('avatar/')) reutrn `${config.cloudinary.base}/image/upload/${key}`
	return `${config.qiniu.thumb}${key}`
}
export const video = function (key) {
	if (key.includes('http')) return key
	if (key.includes('avatar/')) reutrn `${config.cloudinary.base}/video/upload/${key}`
	return `${config.qiniu.video}${key}`
}
