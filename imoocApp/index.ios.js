/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  View,
  Text,
  TabBarIOS
} from 'react-native' 
import Icon from 'react-native-vector-icons/Ionicons'

class List extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>列表页面</Text>
      </View>
    )
  }
}

class Edit extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>制作页面</Text>
      </View>
    )
  }
}

class Account extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>账户页面</Text>
      </View>
    )
  }
}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: 'list'
    }
  }

  _renderContent(color: string, pageText: string, num?: number) {
    return (
      <View style={[styles.tabContent, {backgroundColor: color}]}>
        <Text style={styles.tabText}>{pageText}</Text>
        <Text style={styles.tabText}>{num} re-renders of the {pageText}</Text>
      </View>
    );
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
