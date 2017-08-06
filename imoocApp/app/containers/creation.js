import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import CreationList from '../pages/creation/index'
import * as creationActions from '../actions/creation'

class CreationContainer extends React.Component {
  static propTypes = {
    navigation: PropTypes.opject,
    
    fetchCreations: PropTypes.func
  }
  componentDidMount () {
    this.props.fetchCreations()
  }
  _onLoadItem (row) {
    this.props.navigation.navigate('Detail', {
      rowData: row
    })
  }

  render () {
    return (
      <CreationList
        onLoadItem={this._onLoadItem.bind(this)}
        {...this.props}
      />
    )
  }
}

function mapStateToProps (state) {
  const {
    user
  } = state.get('app')

  const {
    isRefreshing,
    isLoadingTail,
    videoList,
    videoTotal,
    page
  } = state.get('creations')

  return {
    isRefreshing,
    isLoadingTail,
    videoList,
    videoTotal,
    page,
    user
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(creationActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CreationContainer)

