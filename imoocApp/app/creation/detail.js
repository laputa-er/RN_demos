/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import Video from 'react-native-video'
import {
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
		console.log(data)
		console.log('progress')
	}

	_onEnd() {
		console.log('end')
	}

	_onError(err) {
		console.log(err)
		console.log('error')
	}

	_backToList() {
		this.props.navigator.pop()
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
						onError={this._onError}
					></Video>
				</View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
	}
})