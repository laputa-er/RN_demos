/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 
import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

import {
  StyleSheet,
  View,
  Text,
  ListView,
  TouchableHighlight,
  Image,
  Dimensions
} from 'react-native' 
const width = Dimensions.get('window').width

export default class List extends Component {
  constructor(props) {
    super(props)
    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    this.state = {
      dataSource: ds.cloneWithRows([
        {
            "_id": "810000198410164559",
            "thumb": "http://dummyimage.com/1280x720/e82409)",
            "title": "测试内容ic26",
            "video": "http://szv1.mukewang.com/58100e84b3fee35c0f8b456b/H.mp4"
        },
        {
            "_id": "220000198102108889",
            "thumb": "http://dummyimage.com/1280x720/e61817)",
            "title": "测试内容ic26",
            "video": "http://szv1.mukewang.com/58100e84b3fee35c0f8b456b/H.mp4"
        },
        {
            "_id": "510000201011096417",
            "thumb": "http://dummyimage.com/1280x720/7c2721)",
            "title": "测试内容ic26",
            "video": "http://szv1.mukewang.com/58100e84b3fee35c0f8b456b/H.mp4"
        },
        {
            "_id": "140000199305041519",
            "thumb": "http://dummyimage.com/1280x720/665906)",
            "title": "测试内容ic26",
            "video": "http://szv1.mukewang.com/58100e84b3fee35c0f8b456b/H.mp4"
        }
      ])
    }
  }

  renderRow(row) {
    return (
      <TouchableHighlight>
        <View style={styles.item}>
          <Text style={styles.itemTtitle}>{row.title}</Text>
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

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.header__title}>列表页面</Text>
        </View>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          enableEmptySections={true}
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
  title: {
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
  }
})