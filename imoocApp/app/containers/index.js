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
import Slider from './app/account/slider'

// 方法、接口或相关变量声明
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TabBarIOS,
  AsyncStorage,
  ActivityIndicator,
  Dimensions
} from 'react-native' 
import { Navigator } from 'react-native-deprecated-custom-components'

const width = Dimensions.get('window').width
const height = Dimensions.get('window').height

class App extends Component {
  state = {
    selectedTab: 'list',
    logined: false,
    user: null,
    booted: false,
    entered: false
  };

  componentDidMount() {
    this._asyncAppStatus()
  }

  _asyncAppStatus() {
    AsyncStorage.multiGet(['user', 'entered'])
      .then(data => {
        const userData = data[0][1]
        const entered = data[1][1]
        let user
        const newState = { booted: true }
        if (userData) {
          user = JSON.parse(data)
        }
        if (user && user.accessToken) {
          newState.user = user
          newState.logined = true
        }
        else {
          newState.logined = false
        }

        if (entered === 'yes') {
          newState.entered = true
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

  _logout() {
    AsyncStorage.removeItem('user')
    this.setState({
      logined: false,
      user: null
    })
  }

  _enterSlide() {
    this.setState({
      entered: true
    }, () => {
      AsyncStorage.setItem('entered', 'yes')
    })
  }

  render() {
    if (!this.state.booted) {
      return (
        <View style={styles.bootPage}>
          <ActivityIndicator color='#ee735c' />
        </View>
      )
    }

    if (!this.state.entered) {
      return <Slider enterSlide={this._enterSlide.bind(this)}/>
    }
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
          <Account user={this.state.user} logout={this._logout.bind(this)}/>
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
  },
  bootPage: {
    width,
    height,
    backgroundColor: '#fff',
    justifyContent: 'center'
  }
})

AppRegistry.registerComponent('imoocApp', () => App)
