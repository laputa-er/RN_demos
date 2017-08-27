import React from 'react'
import PropTypes from 'prop-types'
import Icon from 'react-native-vector-icons/Ionicons'
import request from '../../common/request'
import config from '../../common/config'
import * as util from '../../common/util'

import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  Dimensions
} from 'react-native'

const width = Dimensions.get('window').width

export default class Item extends React.Component {
  static propTypes = {
    row: PropTypes.object,
    user: PropTypes.object,

    popAlert: PropTypes.func,
    onSelect: PropTypes.func
  }
  constructor (props) {
    super(props)
    const row = this.props.row

    this.state = {
      up: row.voted,
      row: row
    }
  }

  _up () {
    let up = !this.state.up
    const row = this.state.row
    const url = config.api.up

    const body = {
      id: row._id,
      up: up ? 'yes' : 'no',
      accessToken: this.props.user.accessToken
    }

    request.post(url, body)
      .then(data => {
        if (data && data.success) {
          this.setState({
            up: up
          })
        } else {
          this.props.popAlert('失败', '点赞失败，稍后重试')
        }
      })
      .catch(() => {
        this.props.popAlert('失败', '点赞失败，稍后重试')
      })
  }

  render () {
    const row = this.state.row

    return (
      <TouchableHighlight onPress={this.props.onSelect.bind(this)}>
        <View style={styles.item}>
          <Text style={styles.title}>{row.title}</Text>
          <Image
            source={{uri: util.thumb(row.qiniu_thumb)}}
            style={styles.thumb}
          >
            <Icon
              name='ios-play'
              size={28}
              style={styles.play} />
          </Image>
          <View style={styles.itemFooter}>
            <View style={styles.handleBox}>
              <Icon
                name={this.state.up ? 'ios-heart' : 'ios-heart-outline'}
                size={28}
                onPress={this._up.bind(this)}
                style={[styles.up, this.state.up ? null : styles.down]} />
              <Text style={styles.handleText} onPress={this._up.bind(this)}>喜欢</Text>
            </View>
            <View style={styles.handleBox}>
              <Icon
                name='ios-chatboxes-outline'
                size={28}
                style={styles.commentIcon} />
              <Text style={styles.handleText}>评论</Text>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  item: {
    width: width,
    marginBottom: 10,
    backgroundColor: '#fff'
  },

  thumb: {
    width: width,
    height: width * 0.56,
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
    width: width / 2 - 0.5,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },

  play: {
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

  down: {
    fontSize: 22,
    color: '#333'
  },

  up: {
    fontSize: 22,
    color: '#ed7b66'
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
