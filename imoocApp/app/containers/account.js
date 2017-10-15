import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import Account from '../pages/account/index'
import * as appActions from '../actions/app'

class AccountContainer extends React.Component {
  render () {
    return (
      <Account {...this.props}/>
    )
  }
}

function mapStateToProps (state) {
  const {
    user
  } = state.get('app')

  return {
    user
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(appActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountContainer)
