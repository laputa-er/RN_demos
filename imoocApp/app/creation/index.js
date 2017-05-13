/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 
import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

import * as request from '../common/request'
import config from '../common/config'

import {
	RefreshControl,
  StyleSheet,
  View,
  Text,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions,
	ActivityIndicator
} from 'react-native' 
const width = Dimensions.get('window').width
const cachedResults = {
	nextPage: 1,
	items: [],
	total: 0
}


export default class List extends Component {
  constructor(props) {
    super(props)
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.state = {
			isRefreshing: false,
			isLoadingMore: false,
      dataSource: ds.cloneWithRows([])
    }
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
    return (
      <TouchableHighlight>
        <View style={styles.item}>
          <Text style={styles.itemTitle}>{row.title}</Text>
          <Image
            source={{uri: row.thumb}}
            style={styles.thumb}
          >
            <Icon
              name='ios-play'
              size={28}
              style={styles.itemPlay} />
          </Image>
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon
                name='ios-heart-outline'
                size={28}
                style={styles.up} />
              <Text style={styles.handleText}></Text>
            </View>
            <View style={styles.handleBox}>
              <Icon
                name='ios-chatboxes-outline'
                size={28}
                style={styles.commentIcon} />
              <Text style={styles.handleText}></Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
	
	componentDidMount() {
		this._fetchData(1)
	}

	_onRefresh() {
		if (!this._hasMore() || this.state.isRefreshing) {
			return
		}
		this.setState({
			isRefreshing: true
		})
		this._fetchData(0)
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
		if (page === 0) {
			this.setState({
				isRefreshing: true
			})
		}
		else {
			this.setState({
				isLoadingTail: true
			})
		}

		request.get(config.api.base + config.api.creations, {
			accessToken: '12345',
			page
		})
		.then(data => {
			if (data.success) {
				let items = cachedResults.items.slice()
				if (page === 0) {
					cachedResults.items = data.data.concat(items)
					this.setState({
						isRefreshing: false,
						dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
					})
				}
				else {
					cachedResults.items = items.concat(data.data)
					cachedResults.nextPage++
					this.setState({
						isLoadingTail: false,
						dataSource: this.state.dataSource.cloneWithRows(cachedResults.items)
					})
				}
				cachedResults.total = data.total
			}
		})
		.catch(error => {
			if (page === 0) {
				this.setState({
					isRefreshing: false
				})
			}
			else {
				this.setState({
					isLoadingTail: false
				})
			}
			console.error(error)
		})
	}

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>列表页面</Text>
        </View>
        <ListView
					refreshControl={
						<RefreshControl
							refreshing={this.state.isRefreshing}
							onRefresh={this._onRefresh.bind(this)}
							tintColor='#ff6600'
							title='拼命加载中'
						/>
					}
          dataSource={this.state.dataSource}
          renderRow={this._renderRow.bind(this)}
					renderFooter={this._renderFooter.bind(this)}
					onEndReached={this._fetchMoreData.bind(this)}
					onEndReachedThreshold={20}
          enableEmptySections={true}
					showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  header: {
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c'
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600'
  },
  item: {
    width,
    marginBottom: 10,
    marginBottom: 10,
    backgroundColor: '#fff'
  },
  thumb: {
    width,
    height: width * 0.5,
    resizeMode: 'cover'
  },
  itemTitle: {
    padding: 10,
    fontSize: 18,
    color: '#333'
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eee'
  },
  handleBox: {
    padding: 10,
    flexDirection: 'row',
    width: width / 2 - 0.56,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  itemPlay: {
    position: 'absolute',
    bottom: 14,
    right: 14,
    width: 46,
    height: 46,
    paddingTop: 9,
    paddingLeft: 18, 
    backgroundColor: 'transparent',
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 23,
    color: '#ed7b66'
  },
  handleText: {
    paddingLeft: 12,
    fontSize: 18,
    color: '#333'
  },
  up: {
    fontSize: 22,
    color: '#333'
  },
  commentIcon: {
    fontSize: 22,
    color: '#333'
  },
	loadingMore: {
		marginVertical: 20
	},
	loadingText: {
		color: '#777',
		textAlign: 'center'
	}
})