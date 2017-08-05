import React, { Component } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// import Login from '../pages/account/login'
// import Slider from '../pages/slider/index'
// import Boot from '../components/boot'

import Tabs from './tabs'
import * as appActions from '../actions/app'

import { AsyncStorage } from 'react-native'

AsyncStorage.multiRemove(['booted', 'user', 'logined', 'entered'])

class App extends Component {
	componentDidMount() {
		this.props.willEnterApp()
	}
  render() {
    // if (!this.props.booted) {
    //   return <Boot {...this.props} />
    // }

    // if (!this.props.entered) {
    //   return <Slider {...this.props} />
    // }

    // if (!this.props.logined) {
    //   return <Login {...this.props} />
    // }
    return <Tabs {...this.props} />
  }
}

function mapStateToProps (state) {
  return {
    booted: state.get('app').booted,
    logined: state.get('app').logined,
    entered: state.get('app').entered,
    banners: state.get('app').banners,
    popup: state.get('app').popup
  }
}

// 将 action 作为 props 绑定到组件上
function mapDispatchToProps(dispatch) {
	return bindActionCreators(appActions, dispatch)
}


export default connect(mapStateToProps, mapDispatchToProps)(App)
