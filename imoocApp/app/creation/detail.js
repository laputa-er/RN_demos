/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/Ionicons'

import {
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

	_onLoad() {
		console.log('loads')
	}

	_onProgress(data) {
		if (!this.state.videoLoaded) {
			this.setState({
				videoLoaded: true
			})
		}
		const duration = data.playableDuration
		const currentTime = data.currentTime
		const percent = Number((currentTime / duration).toFixed(2))

		let newState = {
			videoTotal: duration,
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
		console.log(err)
		console.log('error')
	}

	_backToList() {
		this.props.navigator.pop()
	}

	_rePlay() {
		this.refs.videoPlayer.seek(0)
	}

  render() {
		const data = this.props.data
    return (
      <View style={styles.container}>
        <Text onPress={this._backToList.bind(this)}>详情页面{data._id}</Text>
				<View style={styles.videoBox}>
					<Video
						ref='videoPlayer'
						source={{uri: data.video}}
						style={styles.video}
						volum={5}
						pause={false}
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
					<View style={styles.progressBox}>
						<View style={[styles.progressBar, {width: width * this.state.videoProgress}]}></View>
					</View>
				</View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
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
	}
})