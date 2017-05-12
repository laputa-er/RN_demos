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

export default class Edit extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>制作页面</Text>
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