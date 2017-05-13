/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import Video from 'react-native-video'
import Icon from 'react-native-vector-icons/Ionicons'

import * as request from '../common/request'
import config from '../common/config'

import {
	ListView,
	Image,
	TouchableOpacity,
	ActivityIndicator,
	Dimensions,
  StyleSheet,
  View,
  Text
} from 'react-native' 
const width = Dimensions.get('window').width

const cachedResults = {
	nextPage: 1,
	items: [],
	total: 0
}



export default class Detail extends Component {
	constructor(props) {
		super(props)

		const ds = new ListView.DataSource({
			rowHasChanged: (r1, r2) => r1 !== r2
		})

		this.state = {
			// comments
			dataSource: ds.cloneWithRows([]),

			// video loads
			videoOk: true,
			paused: false,
			playing: false,
			videoLoaded: false,
			videoProgress: 0.01,
			videoTotal: 0,
			currentTime: 0,
			
			// video player
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

	componentDidMount() {
		this._fetchData()
	}
	
	_renderHeader() {
		const data = this.state.data
		return (
			<View style={styles.infoBox}>
				<Image style={styles.avatar} source={{uri: data.author.avatar}} />
				<View style={styles.descBox}>
					<Text style={styles.nickName}>{data.author.nickName}</Text>
					<Text style={styles.title}>{data.title}</Text>
				</View>
			</View>
		)
	}

	_renderFooter() {
		// 至少加载过一次，而且所有列表数据都加载过来了
		if (!this._hasMore() && cachedResults.total !== 0) {
			return (
				<View style={styles.loadingMore}>
					<Text style={styles.loadingText}>没有更多了</Text>
				</View>
			)
		}
		// 没有在加载，返回一个空元素
		if (!this.state.isLoadingTail) {
			return <View style={styles.loadingMore} />
		}
		return <ActivityIndicator style={styles.loadingMore} />
	}

  _renderRow(row) {
    return <Item row={row} onSelect={() => this._loadPage(row)}/>
  }
	
	componentDidMount() {
		this._fetchData(1)
	}


	_hasMore() {
		return cachedResults.items.length !== cachedResults.total
	}

	_fetchMoreData() {
		if (!this._hasMore() || this.state.isLoadingTail) {
			return
		}
		
		this._fetchData(cachedResults.nextPage)
	}

	_fetchData(page) {
		this.setState({
			isLoadingTail: true
		})

		request.get(config.api.base + config.api.comment, {
			accessToken: '12345',
			creation: 124,
			page
		})
		.then(data => {
			if (data.success) {
				let items = cachedResults.items.slice()
				cachedResults.items = items.concat(data.data)
				cachedResults.nextPage++
				this.setState({
					isLoadingTail: false,
					dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
				})
				cachedResults.total = data.total
			}
		})
		.catch(error => {
			this.setState({
				isLoadingTail: false
			})
			console.error(error)
		})
	}

	_renderRow(row) {
		return (
			<View key={row._id} style={styles.replyBox}>
				<Image
					style={styles.replyAvatar}
					source={{uri: row.replyBy.avatar}}/>
				<View style={styles.reply}>
					<Text style={styles.replyNickName}>{row.replyBy.nickName}</Text>
					<Text style={styles.replyContent}>{row.content}</Text>
				</View>
			</View>
		)
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
				<ListView
					renderHeader={this._renderHeader.bind(this)}
					renderFooter={this._renderFooter.bind(this)}
					onEndReached={this._fetchMoreData.bind(this)}
					dataSource={this.state.dataSource}
					renderRow={this._renderRow.bind(this)}
					enableEmptySections={true}
					showsVerticalScrollIndicator={false}
					automaticallyAdjustContentInsets={false}
				/>
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
		top: 90,
		width,
		color: '#fff',
		textAlign: 'center',
		alignSelf: 'center',
		backgroundColor: 'transparent'
	},
	loading: {
		position: 'absolute',
		left: 0,
		top: 80,
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
		height: width * 0.56,
		backgroundColor: '#000'
	},
	video: {
		width,
		height: width * 0.56,
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
		width,
		height: 360
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
		width,
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
	replyNickName: {
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
	}
})