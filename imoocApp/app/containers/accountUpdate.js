import React from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import AccountUpdate from '../pages/account/update'
import * as appActions from '../actions/app'

class AccountUpdateContainer extends React.Component {
  render () {
    return (
      <AccountUpdate {...this.props}/>
    )
  }
}

function mapStateToProps (state) {
  const {
    user,
    popup
  } = state.get('app')

  return {
    user,
    popup
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(appActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountUpdateContainer)
