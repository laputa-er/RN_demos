/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 
import _ from 'lodash'
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
import CountDownText from '../components/CountDownText'
import Icon from 'react-native-vector-icons/Ionicons'
import Sound from 'react-native-sound'
import * as Progress from 'react-native-progress'
import { AudioRecorder, AudioUtils } from 'react-native-audio'

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

const defaultState = {
  user: null,
  previewVideo: null,

  videoId: null,
  audioId: null,

  // video upload
  video: null, // 存储上传到七牛后返回的存储空间中的视频文件的相关信息
  videoUploaded: false,
  videoUploading: false,
  videoUploadedProgress: 0.01,

  // video loads
  videoLoaded: false,
  videoProgress: 0.01,
  videoTotal: 0,
  currentTime: 0,
  
  // video player
  repeat: false,
  resizeMode: 'contain',
  muted: true,
  rate: 1,

  // record
  counting: false,
  recording: false,

  // audio
  audioPath: AudioUtils.DocumentDirectoryPath + '/gougou.aac',
  audioPlaying: false,
  recordDone: false,

  audio: null,
  audioUploaded: false,
  audioUploading: false,
  audioUploadedProgress: 0.01,
}
export default class Edit extends Component {
  constructor(props) {
    super(props)
    this.state.user = props.user
  }
  state = _.cloneDeep(defaultState);

  _onLoadStart() {
	}

	_onLoad(data) {
		this.setState({
			videoTotal: data.duration
		})
	}

	_onProgress(data) {
		const duration = data.playableDuration
		const currentTime = data.currentTime
		const percent = Number((currentTime / duration).toFixed(2))
		this.setState({
      videoTotal: duration,
      currentTime: Number(data.currentTime.toFixed(2)),
      videoProgress: percent
    })
	}

	_onEnd() {
    if (this.state.recording) {
      AudioRecorder.stopRecording()
      this.setState({
        videoProgress: 1,
        recording: false,
        recordDone: true
      })
    }
	}

  _record() {
    this.setState({
      videoProgress: 0,
      counting: false,
      recording: true,
      recordDone: false
    })
    AudioRecorder.startRecording()
    this.refs.videoPlayer.seek(0)
  }

  _counting() {
    if (!this.state.counting && !this.state.recording && !this.state.sudioPlaying) {
      this.setState({
        counting: true
      })
      this.refs.videoPlayer.seek(this.state.videoTotal - 0.01)
    }
  }

	_onError(err) {
		if (this.state.videoOk) {
			this.setState({
				videoOk: false
			})
		}
	}

  _upload(body, type) {
    const xhr = new XMLHttpRequest()
    let url = config.qiniu.upload

    if (type === 'audio') {
      url = config.cloudinary.video
    }
    const state = {}
    state[type + 'UploadedProgress'] = 0
    state[type + 'Uploading'] = true
    state[type + 'Uploaded'] = false
    
    this.setState(state)

    xhr.open('POST', url)
    xhr.onload = () => {
      if (xhr.status !== 200) {
        AlertIOS.alert('请求失败')
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

      const newState = {}
      newState[type] = response
      newState[type] = response
      newState[type + 'Uploading'] = false
      newState[type + 'Uploaded'] = true
      this.setState(newState)

      const updateURL = config.api.base + config.api[type]
      const accessToken = this.state.user.accessToken
      const updateBody = {
        accessToken,
        [type]: response
      }

      if (type === 'audio') {
        updateBody.videoId = this.state.videoId
      }
      request
      .post(updateURL, updateBody)
      .catch(err => {
        if (type === 'video') {
          AlertIOS.alert('视频同步出错，请重新上传！')
        }
        else if (type === 'audio') {
          AlertIOS.alert('音频同步出错，请重新上传！')
        }
      })
      .then(data => {
        console.log(data)
        if (data && data.success) {
          const mediaState = {}
          mediaState[`${type}Id`] = data.data
          this.setState(mediaState)
        }
        else {
          if (type === 'video') {
            AlertIOS.alert('视频同步出错，请重新上传！')
          }
          else if (type === 'audio') {
            AlertIOS.alert('音频同步出错，请重新上传！')
          }
        }
      })
    }
    
    // 获取视频上传进度
    if (xhr.upload) {
      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          const percent = Number((event.loaded / event.total).toFixed(2))
          this.setState({
            [type + 'UploadedProgress']: percent
          })
        }
      }
    }
    xhr.send(body)
  }
  _getToken(body) {
    body.accessToken = this.state.user.accessToken
    const signatureURL = config.api.base + config.api.signature

    // 先从服务器获取签名，然后开始上传视频
    return request.post(signatureURL, body)
  }

  _pickVideo() {
    ImagePicker.showImagePicker(videoOptions, res => {
      if (res.didCancel) {
        return
      }
      const state = _.cloneDeep(defaultState)
      state.previewVideo = res.uri
      state.user = this.state.user
      this.setState(state)

      this._getToken({
        type: 'video',
        cloud: 'qiniu'
      })
      .catch(err => {
        console.log(err)
        AlertIOS.alert('上传出错')
      })
      .then(data => {
        if (data && data.success) {
          const token = data.data.token
          const key = data.data.key
          const body = new FormData()

          body.append('token', token)
          body.append('key', key)
          body.append('file', {
            type: 'video/mp4',
            uri: res.uri,
            name: key
          })
          this._upload(body, 'video')
        }
      })
    })
  }

  async _preview() {
    if (this.state.audioPlaying) {
      AudioRecorder.stopRecording()
    }

    setTimeout(() => {
      const sound = new Sound(this.state.audioPath, '', (error) => {
        if (error) {
          console.log('failed to load the sound', error);
        }
      });
      setTimeout(() => {
        sound.play((success) => {
          if (success) {
            this.setState({
              videoPlayer: 0,
              audioPlaying: true
            })
          }
          else {
            console.log('playback failed due to audio decoding errors');
          }
        });
        this.refs.videoPlayer.seek(0) // 将视频播放进度重置到 0
      }, 100);
    }, 100);
  }

  _uploadAudio() {
    const tags = 'app,audio'
    const folder = 'audio'
    const timestamp = Date.now()
    this._getToken({
      type: 'audio',
      timestamp,
      cloud: 'cloudinary'
    })
    .catch(err => {
      console.log(err)
    })
    .then(data => {
      if (data && data.success) {
        const signature = data.data.token
        const key = data.data.key
        const body = new FormData()
        body.append('folder', folder)
        body.append('signature', signature)
        body.append('tags', tags)
        body.append('timestamp', timestamp)
        body.append('api_key', config.cloudinary.api_key)
        body.append('resource_type', 'video')
        body.append('file', {
          type: 'video/mp4',
          uri: this.state.audioPath,
          name: key
        })
        this._upload(body, 'audio')
      }
    })
  }
  _initAudio() {
    AudioRecorder.prepareRecordingAtPath(this.state.audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: 'High',
      AudioEncoding: 'aac'
    })

    AudioRecorder.onProgress = (data) => {
      this.setState({ currentTime: Math.floor(data.currentTime) })
    }

    AudioRecorder.onFinished = (data) => {
      this.setState({
        finished: data.finished
      })
    }
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
    this._initAudio()
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
            this.state.previewVideo && this.state.videoUploaded
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
                          正在生成静音视频，已完成{~~(this.state.videoUploadedProgress * 100)}%
                        </Text>
                      </View>
                    : null
                  }

                  {
                    this.state.recording || this.state.audioPlaying
                    ? <View style={styles.progressTipBox}>
                        <ProgressViewIOS
                          style={styles.progressBar}
                          processTintColor='#ee735c'
                          progress={this.state.videoProgress} />
                        {
                          this.state.recording
                          ? <Text style={styles.progressTip}>
                              录制声音中
                            </Text>
                          : null
                        }
                      </View>
                    : null
                  }

                  {
                    this.state.recordDone
                    ? <View style={styles.previewBox}>
                        <Icon name="ios-play" style={styles.previewIcon} />
                        <Text style={styles.previewText} onPress={this._preview.bind(this)}>预览</Text>
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
          {
            this.state.videoUploaded
            ?  <View style={styles.recordBox}>
                <View style={[styles.recordIconBox, (this.state.recording || this.state.audioPlaying) && styles.recordOn]}>
                  {
                    this.state.counting && !this.state.recording
                    ? <CountDownText
                        style={styles.countBtn}
                        countType='seconds'
                        auto={true}
                        afterEnd={this._record.bind(this)}
                        timeLeft={3}
                        step={-1}
                        startText='准备录制'
                        endText='Go'
                        intervalText={sec => sec === 0 ? 'Go' : sec} />
                    : <TouchableOpacity onPress={this._counting.bind(this)}>
                        <Icon
                          name='ios-mic'
                          style={styles.recordIcon} />
                      </TouchableOpacity> 
                  }
                </View>
              </View>
            : null
          }

          {
            this.state.videoUploaded && this.state.recordDone
            ? <View style={styles.uploadAudioBox}>
              {
                !this.state.audioUploaded && !this.state.audioUploading    
                ? <Text style={styles.uploadAudioText} onPress={this._uploadAudio.bind(this)}>下一步</Text>
                : null
              }
              {
                this.state.audioUploading
                ? <Progress.Circle
                    showsText={true}
                    size={60}
                    color={'#ee735c'}
                    progress={this.state.audioUploadedProgress}
                  />
                : null
              }
                
              </View>
            : null
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
  },
  recordBox: {
    width,
    height: 60,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fff'
  },
  recordIconBox: {
    width: 68,
    height: 68,
    marginTop: -30,
    borderRadius: 34,
    backgroundColor: '#ee735c',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  recordIcon: {
    fontSize: 58,
    backgroundColor: 'transparent',
    color: '#fff'
  },
  countBtn: {
    fontSize: 32,
    fontWeight: '600',
    color: '#fff'
  },
  recordOn: {
      backgroundColor: '#ccc'
  },
  previewBox: {
    width: 80,
    height: 30,
    position: 'absolute',
    right: 10,
    bottom: 10,
    borderWidth: 1,
    borderColor: '#ee735c',
    borderRadius: 3,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  previeIcon: {
    marginRight: 5,
    fontSize: 20,
    color: '#ee735c',
    backgroundColor: 'transparent'
  },
  previewText: {
    fontSize: 20,
    color: '#ee735c',
    backgroundColor: 'transparent'
  },
  uploadAudioBox: {
    width,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  uploadAudioText: {
    width: width - 20,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ee735c',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 20,
    color: '#ee735c'
  }
})