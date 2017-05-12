/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

// 原生模块
import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

// 自定义 RN 模块
import List from './app/creation/index'
import Edit from './app/edit/index'
import Account from './app/account/index'

// 方法、接口或相关变量声明
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TabBarIOS
} from 'react-native' 


class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'list'
    }
  }

  render() {
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
          <List />
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
              selectedTab: 'account',
              presses: this.state.presses + 1
            });
          }}>
          <Account />
        </Icon.TabBarItem>
      </TabBarIOS>
    );
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
