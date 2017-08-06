import React from 'react'
import PropTypes from 'prop-types'
import Popup from '../../components/popup'
import NoMore from '../../components/nomore'
import Loading from '../../components/loading'
// import Detail from './detail'
import Item from './item'

import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as appActions from '../../actions/app'
import {
  StyleSheet,
  View,
  ListView,
  RefreshControl
} from 'react-native'

class List extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    videoList: PropTypes.array,
    videoTotal: PropTypes.number,
    isLoadingTail: PropTypes.bool,
    isRefreshing: PropTypes.bool,
    
    fetchCreations: PropTypes.func,
    popAlert: PropTypes.func,
    onLoadItem: PropTypes.func
  }
  _popup (title, content) {
    this.props.popAlert(title, content)
  }

  _renderRow (row) {
    return <Item
      key={row._id}
      user={this.props.user}
      popAlert={this._popup.bind(this)}
      onSelect={() => this.props.onLoadItem(row)}
      row={row} />
  }

  _hasMore () {
    const {
      videoList,
      videoTotal
    } = this.props

    return videoList.length < videoTotal
  }

  _fetchMoreData () {
    const {
      isLoadingTail,
      fetchCreations
    } = this.props

    if (this._hasMore() && !isLoadingTail) {
      fetchCreations()
    }
  }

  _onRefresh () {
    this.props.fetchCreations('recent')
  }

  _renderFooter () {
    const {
      videoTotal,
      isLoadingTail
    } = this.props

    if (!this._hasMore() && videoTotal !== 0) {
      return <NoMore />
    }

    if (isLoadingTail) {
      return <Loading />
    }

    return null
  }

  render () {
    const {
      videoList,
      isRefreshing,
    } = this.props

    let ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    })

    let dataSource = ds.cloneWithRows(videoList)

    return (
      <View style={styles.container}>
        <ListView
          dataSource={dataSource}
          renderRow={this._renderRow.bind(this)}
          renderFooter={this._renderFooter.bind(this)}
          onEndReached={this._fetchMoreData.bind(this)}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          onEndReachedThreshold={20}
          enableEmptySections
          showsVerticalScrollIndicator={false}
          automaticallyAdjustContentInsets={false}
        />
        <Popup {...this.props} />
      </View>
    )
  }
}

function mapStateToProps (state) {
  return {
    popup: state.get('app').popup
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(appActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(List)

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
