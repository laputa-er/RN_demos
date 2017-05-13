/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/Ionicons'

import {
	TouchableOpacity,
	ActivityIndicator,
	Dimensions,
  StyleSheet,
  View,
  Text
} from 'react-native' 
const width = Dimensions.get('window').width


export default class Detail extends Component {
	constructor(props) {
		super(props)
		this.state = {
			videoOk: true,
			paused: false,
			playing: false,
			videoLoaded: false,
			
			videoProgress: 0.01,
			videoTotal: 0,
			currentTime: 0,
			
			
			repeat: false,
			resizeMode: 'contain',

			muted: false,
			rate: 1,

			data: this.props.data
		}
	}

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

	_pop() {
		this.props.navigator.pop()
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

  render() {
		const data = this.props.data
    return (
      <View style={styles.container}>
				<View style={styles.header}>
					<TouchableOpacity
						style={styles.backBox}
						onPress={this._pop.bind(this)}>
						<Icon
							name='ios-arrow-back'
							style={styles.backIcon}/>
						<Text style={styles.backText}>返回</Text>
					</TouchableOpacity>
        	<Text onPress={this._pop.bind(this)}>详情页面{data._id}</Text>
				</View>
				<View style={styles.videoBox}>
					<Video
						ref='videoPlayer'
						source={{uri: data.video}}
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
						!this.state.videoOk && <Text style={styles.failText}>视频出错了！很抱歉</Text>
					}
					{
						!this.state.videoLoaded && <ActivityIndicator color='#ee735c' style={styles.loading}/>
					}
					{
						this.state.videoLoaded && !this.state.playing
						? <Icon
								onPress={this._rePlay.bind(this)}
								name='ios-play'
								size={48}
								style={styles.playIcon} />
						: null
					}
					{
						this.state.videoLoaded && this.state.playing
						? <TouchableOpacity
								onPress={this._pause.bind(this)}
								style={styles.pauseBtn}>
								{
									this.state.paused
									? <Icon
											size={48}
											onPress={this._resume.bind(this)}
											name='ios-play'
											style={styles.resumeIcon} />
									: <Text></Text>
								}
							</TouchableOpacity>
						: null
					}
					<View style={styles.progressBox}>
						<View style={[styles.progressBar, {width: width * this.state.videoProgress}]}></View>
					</View>
				</View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width,
		height: 64,
		paddingTop: 20,
		paddingLeft: 10,
		borderBottomWidth: 1,
		borderColor: 'rgba(0, 0, 0, 0.1)',
		backgroundColor: '#fff'
	},
	backBox: {
		position: 'absolute',
		left: 12,
		top: 32,
		width: 50,
		flexDirection: 'row',
		alignItems: 'center'
	},
	headerTitle: {
		width: width - 120,
		textAlign: 'center'
	},
	backIcon: {
		color: '#999',
		fontSize: 20,
		marginRight: 5
	},
	backText: {
		color: '#999'
	},
	failText: {
		position: 'absolute',
		left: 0,
		top: 180,
		width,
		color: '#fff',
		textAlign: 'center',
		alignSelf: 'center',
		backgroundColor: 'transparent'
	},
	loading: {
		position: 'absolute',
		left: 0,
		top: 140,
		width,
		alignSelf: 'center',
		backgroundColor: 'transparent'
	},
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
	videoBox: {
		width,
		height: 360,
		backgroundColor: '#000'
	},
	video: {
		width,
		height: 360,
		backgroundColor: '#000'
	},
	progressBox: {
		width,
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
		top: 140,
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
		width,
		height: 360
	},
	resumeIcon: {
		position: 'absolute',
		top: 140,
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
	}
})