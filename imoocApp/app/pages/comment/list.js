import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import * as commentActions from '../../actions/comment'

import NoMore from '../../components/nomore'
import Loading from '../../components/loading'
import * as util from '../../common/util'

import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ListView,
  Image,
  TextInput
} from 'react-native'

const { width } = Dimensions.get('window')

class CommentList extends React.Component {
  static propTypes = {
    rowData: PropTypes.object,
    fetchComments: PropTypes.func,
    navigation: PropTypes.object,
    commentTotal: PropTypes.number,
    isCommentLoadingTail: PropTypes.bool,
    commentList: PropTypes.array
  }

  componentDidMount () {
    console.log(this.props.rowData, this.props.rowData._id)
    this.props.fetchComments(this.props.rowData._id)
  }

  _renderRow (row) {
    return (
      <View key={row._id} style={styles.replyBox}>
        <Image style={styles.replyAvatar} source={{uri: util.avatar(row.replyBy.avatar)}} />
        <View style={styles.reply}>
          <Text style={styles.replyNickname}>{row.replyBy.nickname}</Text>
          <Text style={styles.replyContent}>{row.content}</Text>
        </View>
      </View>
    )
  }

  _focus () {
    this.props.navigation.navigate('Comment', {
      rowData: this.props.rowData
    })
  }

  _renderHeader = () => {
    const data = this.props.rowData

    return (
      <View style={styles.listHeader}>
        <View style={styles.infoBox}>
          <Image style={styles.avatar}
            source={{uri: util.avatar(data.author.avatar)}} />
          <View style={styles.descBox}>
            <Text style={styles.nickname}>{data.author.nickname}</Text>
            <Text style={styles.title}>{data.title}</Text>
          </View>
        </View>
        <View style={styles.commentBox}>
          <View style={styles.comment}>
            <TextInput
              underlineColorAndroid='transparent'
              placeholder='敢不敢评论一个...'
              style={styles.content}
              multiline
              onFocus={this._focus.bind(this)}
            />
          </View>
        </View>

        <View style={styles.commentArea}>
          <Text style={styles.commentTitle}>精彩评论</Text>
        </View>
      </View>
    )
  }

  _renderFooter () {
    const {
      commentTotal,
      isCommentLoadingTail
    } = this.props

    if (!this._hasMore() || commentTotal === 0) {
      return <NoMore />
    }

    if (isCommentLoadingTail) {
      return <Loading />
    }

    return null
  }

  _hasMore () {
    const {
      commentList,
      commentTotal
    } = this.props

    return commentList.length < commentTotal
  }

  _fetchMoreData () {
    const {
      isCommentLoadingTail,
      fetchComments
    } = this.props

    if (this._hasMore() && !isCommentLoadingTail) {
      fetchComments(this.props.rowData._id)
    }
  }

  _onRefresh () {
    this.props.fetchComments(this.props.rowData._id, 'recent')
  }

  render () {
    const {
      commentList
    } = this.props

    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    let dataSource = ds.cloneWithRows(commentList)

    return (
      <ListView
        dataSource={dataSource}
        renderRow={this._renderRow.bind(this)}
        renderHeader={this._renderHeader}
        removeClippedSubviews={false}
        renderFooter={this._renderFooter.bind(this)}
        onEndReached={this._fetchMoreData.bind(this)}
        onEndReachedThreshold={20}
        enableEmptySections={false}
        showsVerticalScrollIndicator={false}
        automaticallyAdjustContentInsets={false}
      />
    )
  }
}

function mapStateToProps (state) {
  const {
    user
  } = state.get('app')

  const {
    isCommentRefreshing,
    isCommentLoadingTail,
    commentList,
    commentTotal,
    popup,
    page
  } = state.get('comments')

  return {
    isCommentRefreshing,
    isCommentLoadingTail,
    commentList,
    commentTotal,
    popup,
    page,
    user
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(commentActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentList)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
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
    width,
    marginTop: 10
  },

  commentBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    width
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
    width,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
})
