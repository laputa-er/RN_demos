// 
// index.ios.js
// ==
// @author mengqingshen_sean@outlook.com
// 

// 原生模块
import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

// 自定义 RN 模块
import List from './app/creation/index'
import Edit from './app/edit/index'
import Account from './app/account/index'
import Login from './app/account/login'

// 方法、接口或相关变量声明
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TabBarIOS,
  AsyncStorage
} from 'react-native' 
import { Navigator } from 'react-native-deprecated-custom-components'


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'account',
      logined: false,
      user: null
    }
  }

  componentDidMount() {
    this._asyncAppStatus()
  }

  _asyncAppStatus() {
    AsyncStorage.getItem('user')
      .then(data => {
        let user
        const newState = {}
        if (data) {
          user = JSON.parse(data)
        }

        if (user && user.accessToken) {
          newState.user = user
          newState.logined = true
        }
        else {
          newState.logined = false
        }
        this.setState(newState)
      })
  }

  _afterLogin(user) {
    user = JSON.stringify(user)
    AsyncStorage.setItem('user', user)
      .then(() => {
        this.setState({
          logined: true,
          user
        })
      })
	}

  render() {
    if (!this.state.logined) {
      return <Login afterLogin={this._afterLogin.bind(this)}/>
    }
    return (
      <TabBarIOS tintColor="#ee735c">
        <Icon.TabBarItem
          iconName='ios-videocam-outline'
          selectedIconName='ios-videocam'
          selected={this.state.selectedTab === 'list'}
          onPress={() => {
            this.setState({
              selectedTab: 'list',
            });
          }}>
          <Navigator
            initialRoute={{
              name: 'List',
              component: List
            }}
            configureScene={route => {
              return Navigator.SceneConfigs.FloatFromRight
            }}
            renderScene={(route, navigator) => {
              const Component = route.component
              return <Component {...route.params} navigator={navigator} />
            }}
          />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName='ios-recording-outline'
          selectedIconName='ios-recording'
          selected={this.state.selectedTab === 'edit'}
          onPress={() => {
            this.setState({
              selectedTab: 'edit',
              notifCount: this.state.notifCount + 1,
            });
          }}>
          <Edit />
        </Icon.TabBarItem>
        <Icon.TabBarItem
          iconName='ios-more-outline'
          selectedIconName='ios-more'
          renderAsOriginal
          selected={this.state.selectedTab === 'account'}
          onPress={() => {
            this.setState({
              selectedTab: 'list',
              presses: this.state.presses + 1
            });
          }}>
          <Account user={this.state.user}/>
        </Icon.TabBarItem>
      </TabBarIOS>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
})

AppRegistry.registerComponent('imoocApp', () => App)
