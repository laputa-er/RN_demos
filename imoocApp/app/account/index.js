/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AsyncStorage,
  StyleSheet,
  View,
  Text
} from 'react-native' 

export default class Account extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: {
        nickName: '老四',
        times: 0
      }
    }
  }

  componentDidMount() {
    AsyncStorage
      .getItem('user')
      // 如果能拿到 user 这个数据，则将本地的这个数据同步到 state，然后再修改后存储到本地
      .then(data => {
        if (data) {
          console.log(data)
          data = JSON.parse(data)
          this.setState({
            user: data
          }, () => {
            data.times++
            const userData = JSON.stringify(data)

            AsyncStorage
              .setItem('user', userData)
              .then(() => {
                console.log('save ok')
              })
              .catch(err => {
                console.log(err)
                console.log('save failes')
              })
          })
        }
        // 如果 user 这个这个数据不存在，就从 state 拿出来，编辑后存到本地
        else {
          const user = this.state.user
          user.times++
          const userData = JSON.stringify(user)
          AsyncStorage
            .setItem('user', userData)
            .catch(err => {
              console.log(err)
              console.log('save fails')
            })
            .then(() => {
              console.log('save ok')
            })
        }
      })
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={[styles.item, styles.item1]}>1111111111111</Text>
        <View style={[styles.item, styles.item2]}>
          <Text>22222222222222</Text>
        </View>
        <View style={[styles.item, styles.item3]}>
          <Text>33333333333333</Text>
        </View>
        <Text style={[styles.item, styles.item1]}>
          {this.state.user.nickName}不爽了{this.state.user.times}次
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'nowrap',
    paddingTop: 30,
    paddingBottom: 70,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: '#ff6600'
  },
  item1: {
    backgroundColor: '#ccc',
    flex: 1
  },
  item2: {
    backgroundColor: '#999',
    flex: 2
  },
  item3: {
    backgroundColor: '#666',
    flex: 1
  }
})