import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/Ionicons'
import Video from 'react-native-video'
import * as util from '../../common/util'
import CommentList from '../comment/list'

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native'

const { width } = Dimensions.get('window')

export default class Detail extends React.Component {
  static propTypes = {
    navigation: PropTypes.object,
    rowData: PropTypes.object
  }
  constructor (props) {
    super(props)
    this.state = {
      // video loads
      videoOk: true,
      videoLoaded: false,
      playing: false,
      paused: false,
      videoTotal: 0.0,
      currentTime: 0.0,

      // video player
      rate: 1,
      muted: false,
      resizeMode: 'contain',
      repeat: false
    }
  }

  _onLoadStart () {
    console.log('load start')
  }

  _onLoad (data) {
    this.setState({
      duration: data.duration
    })
  }

  getCurrentimePercentage () {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration)
    }
    else {
      return 0
    }
  }

  _onProgress (data) {
    if (data.playableDuration === 0) {
      this.setState({
        currentTime: this.state.duration,
        playing: false
      })
    }
    else {
      if (!this.state.videoLoaded) {
        this.setState({
          videoLoaded: true
        })
      }
      
      let newState = {
        currentTime: data.currentTime
      }

      if (!this.state.videoLoaded) {
        newState.videoLoaded = true
      }

      if (!this.state.playing) {
        newState.playing = true
      }

      this.setState(newState)

    }
  }

  _onEnd () {
    this.setState({
      currentTime: this.state.duration,
      playing: false
    })
  }

  _onError () {
    this.setState({
      videoOk: false
    })
  }

  _rePlay () {
    this.videoPlayer.seek(0)
  }

  _pause () {
    if (!this.state.paused) {
      this.setState({
        paused: true
      })
    }
  }

  _resume () {
    if (this.state.paused) {
      this.setState({
        paused: false
      })
    }
  }

  render () {
    const data = this.props.rowData
    const videoCompleted = this.getCurrentimePercentage()

    return (
      <View style={styles.container}>
        <View style={styles.videoBox}>
          <Video
            ref={(ref) => {this.videoPlayer = ref}}
            source={{uri: util.video(data.qiniu_video)}}
            style={styles.video}
            volume={5}
            paused={this.state.paused}
            rate={this.state.rate}
            muted={this.state.muted}
            resizeMode={this.state.resizeMode}
            repeat={this.state.repeat}

            onLoadStart={this._onLoadStart.bind(this)}
            onLoad={this._onLoad.bind(this)}
            onProgress={this._onProgress.bind(this)}
            onEnd={this._onEnd.bind(this)}
            onError={this._onError.bind(this)} />

          {
            !this.state.videoOk && <Text style={styles.failText}>视频出错了！很抱歉</Text>
          }

          {
            !this.state.videoLoaded && <ActivityIndicator color='#ee735c' style={styles.loading} />
          }

          {
            this.state.videoLoaded && !this.state.playing
              ? <Icon
                onPress={this._rePlay.bind(this)}
                name='ios-play'
                size={48}
                style={styles.playIcon} />
              //: <Text></Text>
              : null
          }

          {
            this.state.videoLoaded && this.state.playing
              ? <TouchableOpacity onPress={this._pause.bind(this)} style={styles.pauseBtn}>
                {
                  this.state.paused
                    ? <Icon onPress={this._resume.bind(this)} size={48} name='ios-play' style={styles.resumeIcon} />
                    : null
                }
              </TouchableOpacity>
              : null
          }

          <View style={styles.progressBox}>
            <View style={[styles.progressBar, {width: width * videoCompleted}]}></View>
          </View>
        </View>
        <CommentList
          rowData={data}
          navigation={this.props.navigation}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },

  videoBox: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },

  video: {
    width: width,
    height: width * 0.56,
    backgroundColor: '#000'
  },

  failText: {
    position: 'absolute',
    left: 0,
    top: 90,
    width: width,
    textAlign: 'center',
    color: '#fff',
    backgroundColor: 'transparent'
  },

  loading: {
    position: 'absolute',
    left: 0,
    top: 80,
    width: width,
    alignSelf: 'center',
    backgroundColor: 'transparent'
  },

  progressBox: {
    width: width,
    height: 2,
    backgroundColor: '#ccc'
  },

  progressBar: {
    width: 1,
    height: 2,
    backgroundColor: '#ff6600'
  },

  playIcon: {
    position: 'absolute',
    top: 90,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    color: '#ed7b66'
  },

  pauseBtn: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: width,
    height: width * 0.56
  },

  resumeIcon: {
    position: 'absolute',
    top: 80,
    left: width / 2 - 30,
    width: 60,
    height: 60,
    paddingTop: 8,
    paddingLeft: 22,
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 30,
    color: '#ed7b66'
  },

  infoBox: {
    width: width,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10
  },

  avatar: {
    width: 60,
    height: 60,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 30
  },

  descBox: {
    flex: 1
  },

  nickname: {
    fontSize: 18
  },

  title: {
    marginTop: 8,
    fontSize: 16,
    color: '#666'
  },

  replyBox: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 10
  },

  replyAvatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 20
  },

  replyNickname: {
    color: '#666'
  },

  replyContent: {
    marginTop: 4,
    color: '#666'
  },

  reply: {
    flex: 1
  },

  loadingMore: {
    marginVertical: 20
  },

  loadingText: {
    color: '#777',
    textAlign: 'center'
  },

  listHeader: {
    width: width,
    marginTop: 10
  },

  commentBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    width: width
  },

  content: {
    paddingLeft: 4,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    fontSize: 14,
    height: 80
  },

  commentArea: {
    width: width,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
})
