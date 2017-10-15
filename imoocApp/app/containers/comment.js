import React from 'react'
import PropTypes from 'prop-types'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'

import Comment from '../pages/comment/index'
import * as commentActions from '../actions/comment'

class CommentContainer extends React.Component {
  static propTypes = {
    sendComment: PropTypes.func,
    navigation: PropTypes.any
  }
  _submit (content) {
    this.props.sendComment({
      creation: this.props.navigation.state.params.rowData._id,
      content: content
    })
      .then(() => {
        this.props.navigation.goBack()
      })
  }

  render () {
    return (
      <Comment
        submit={this._submit.bind(this)}
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
    isSending
  } = state.get('comments')

  return {
    user,
    isSending
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(commentActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(CommentContainer)
