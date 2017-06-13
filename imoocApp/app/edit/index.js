/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ActivityIndicator,
  ProgressViewIOS,
  AsyncStorage,
  AlertIOS
} from 'react-native' 
import ImagePicker from 'react-native-image-picker'
import Video from 'react-native-video'

import * as request from '../common/request'
import config from '../common/config'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

// 视频选择相关选项配置
const videoOptions = {
  title: '选择视频',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '录制 10 秒视频',
  chooseFormLibraryButtonTitle: '选择已有视频',
  videoQuality: 'medium',
  mediaType: 'video',
  dutationLimit: 10,
  noData: false,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

export default class Edit extends Component {
  state = {
    user: this.props.user || {},
    previewVideo: null,

    // video upload
    video: null, // 存储上传到七牛后返回的存储空间中的视频文件的相关信息
    videoUploaded: false,
    videoUploading: false,
    videoUploadedProgress: 0.01,

    // video loads
    paused: false,
    playing: false,
    videoLoaded: false,
    videoProgress: 0.01,
    videoTotal: 0,
    currentTime: 0,
    
    // video player
    repeat: false,
    resizeMode: 'contain',
    muted: true,
    rate: 1,
  };

  _onLoadStart() {
		console.log('load start')
	}

	_onLoad(data) {
		console.log('loads')
		this.setState({
			videoTotal: data.duration
		})
	}

	_onProgress(data) {
		const duration = data.playableDuration
		const currentTime = data.currentTime
		const percent = Number((currentTime / this.state.videoTotal).toFixed(2))

		if (duration === 0) {
			return
		}
		let newState = {
			currentTime: Number(data.currentTime.toFixed(2)),
			videoProgress: percent
		}
		if (!this.state.videoLoaded) {
			newState.videoLoaded = true
		}
		if (!this.state.playing) {
			newState.playing = true
		}
		this.setState(newState)
	}

	_onEnd() {
		this.setState({
			videoProgress: 1,
			playing: false
		})
		console.log('end')
	}

	_onError(err) {
		if (this.state.videoOk) {
			this.setState({
				videoOk: false
			})
		}
		console.log(err)
		console.log('error')
	}

	_rePlay() {
		this.refs.videoPlayer.seek(0)
	}
	_pause() {
		if (!this.state.paused) {
			this.setState({
				paused: true
			})
		}
	}

	_resume() {
		if (this.state.paused) {
			this.setState({
				paused: false
			})
		}
	}

  _upload(body) {
    console.log(body)
    const xhr = new XMLHttpRequest()
    const url = config.qiniu.upload

    this.setState({
      videoUploadedProgress: 0,
      videoloading: true,
      videoUploaded: false
    })

    xhr.open('POST', url)
    xhr.onload = () => {
      if (xhr.status !== 200) {
        AlertIOS.alert('请求失败')
        console.log(xhr.responseText)
        return
      }

      if (!xhr.responseText) {
        AlertIOS.alert('请求失败')
        return
      }

      let response
      try {
        response = JSON.parse(xhr.response)
      }
      catch (e) {
        console.log(e)
        console.log('parse fails')
      }

      console.log(response)
      if (response) {
        const user = this.state.user
        this.setState({
          video: response,
          videoUploading: false,
          videoUploaded: true
        })

        const videoURL = config.api.base + config.api.video
        const accessToken = this.state.user.accessToken

        request.post(videoURL, {
          accessToken,
          video: response
        })
        .catch(err => {
          console.log(err)
          AlertIOS.alert('视频同步出错，请重新上传！')
        })
        .then(data => {
          if (!data || !data.success) {
            AlertIOS.alert('视频同步出错，请重新上传@')
          }
        })
      }
    }
    
    // 获取视频上传进度
    if (xhr.upload) {
      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          const percent = Number((event.loaded / event.total).toFixed(2))
          this.setState({
            videoUploadedProgress: percent
          })
        }
      }
    }
    xhr.send(body)
  }
  _getQiniuToken() {
    const accessToken = this.state.user.accessToken
    const signatureURL = config.api.base + config.api.signature

    // 先从服务器获取签名，然后开始上传视频
    return request.post(signatureURL, {
      cloud: 'qiniu',
      accessToken,
      type: 'video'
    })
    .catch(err => {
      console.log(err)
    })
  }

  _pickVideo() {
    ImagePicker.showImagePicker(videoOptions, res => {
      if (res.didCancel) {
        return
      }
      var uri = res.uri

      this.setState({
        previewVideo: uri
      })

      this._getQiniuToken()
      .then(data => {
        if (data && data.success) {
          const token = data.data.token
          const key = data.data.key
          const body = new FormData()

          body.append('token', token)
          body.append('key', key)
          body.append('file', {
            type: 'video/mp4',
            uri,
            name: key
          })
          this._upload(body)
        }
      })
    })
  }

  componentDidMount() {
    AsyncStorage.getItem('user')
    .then(data => {
      let user
      if (data) {
        user = JSON.parse(data)
      }
      if (user && user.accessToken) {
        this.setState({
          user
        })
      }
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>
          {
            this.state.previewVideo ? '点击按钮配音' : '理解狗狗，从配音开始'
          }
          </Text>
          {
            this.state.previewVideo && this.state.videoLoaded
            ? <Text style={styles.toolbarExtra} onPress={this._pickVideo.bind(this)}>更换视频</Text>
            : null
          }
        </View>
        <View style={styles.page}>
          {
            this.state.previewVideo
            ? <View style={styles.videoContainer}>
                <View style={styles.videoBox}>
                  <Video
                    ref='videoPlayer'
                    source={{uri: this.state.previewVideo}}
                    style={styles.video}
                    volum={5}
                    paused={this.state.paused}
                    rate={this.state.rate}
                    muted={this.state.muted}
                    resizeMode={this.state.resizeMode}
                    repeat={this.state.repeat}

                    onLoadStart={this._onLoadStart.bind(this)}
                    onLoad={this._onLoad.bind(this)}
                    onProgress={this._onProgress.bind(this)}
                    onEnd={this._onEnd.bind(this)}
                    onError={this._onError.bind(this)}
                  />
                  {
                    !this.state.videoUploaded && this.state.videoUploading
                    ? <View style={styles.progressTipBox}>
                        <ProgressViewIOS
                          style={styles.progressBar}
                          processTintColor='#ee735c'
                          progress={this.state.videoUploadedProgress} />
                        <Text style={styles.progressTip}>
                          正在生成静音视频，已完成{(this.state.videoUploadedProgress * 100)}
                        </Text>
                      </View>
                    : null
                  }
                </View>
              </View>
            : <TouchableOpacity style={styles.uploadContainer}
                onPress={this._pickVideo.bind(this)}>
                <View style={styles.uploadBox}>
                  <Image
                    source={require('../assets/images/record.png')}
                    style={styles.uploadIcon} />
                  <Text style={styles.uploadTitle}>点我上传视频</Text>
                  <Text style={styles.uploadDesc}>建议时长不超过 20 秒</Text>
                </View>
              </TouchableOpacity>
          }
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  toolbar: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c'
  },
  toolbarTitle: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600'
  },
  toolbarExtra: {
    position: 'absolute',
    right: 10,
    top: 26,
    color: '#fff',
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 14
  },
  page: {
    flex: 1,
    alignItems: 'center'
  },
  uploadContainer: {
    marginTop: 90,
    width: width - 40,
    height: 210,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: '#ee735c',
    justifyContent: 'center',
    borderRadius: 6,
    backgroundColor: '#fff'
  },
  uploadTitle: {
    marginBottom: 10,
    textAlign: 'center',
    fontSize: 16,
    color: '#000'
  },
  uploadDesc: {
    color: '#999',
    textAlign: 'center',
    fontSize: 12
  },
  uploadIcon: {
    width: 110,
    resizeMode: 'contain'
  },
  uploadBox: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  videoContainer: {
    width,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  videoBox: {
    width,
    height: height * 0.6
  },
  video: {
    width,
    height: height * 0.6,
    backgroundColor: '#333'
  },
  progressTipBox: {
    position: 'absolute',
    left: 0,
    bottom: 0,
    width,
    height: 30,
    backgroundColor: 'rgba(244, 244, 244, 0.65)'
  },
  progressTip: {
    color: '#333',
    width: width - 10,
    padding: 5
  },
  progressBar: {
    width
  }
})