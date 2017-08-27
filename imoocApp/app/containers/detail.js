import React from 'react'
import {connect} from 'react-redux'

import Detail from '../pages/creation/detail'

class DetailContainer extends React.Component {  
  render () {
    const rowData = this.props.navigation.state.params.rowData

    return (
      <Detail
        rowData={rowData}
        {...this.props}
      />
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

export default connect(mapStateToProps)(DetailContainer)
