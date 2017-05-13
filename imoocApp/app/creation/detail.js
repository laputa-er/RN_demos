/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native' 

export default class Detail extends Component {
	_backToList() {
		this.props.navigator.pop()
	}

  render() {
		const row = this.props.row
    return (
      <View style={styles.container}>
        <Text onPress={this._backToList.bind(this)}>详情页面{row._id}</Text>
      </View>
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