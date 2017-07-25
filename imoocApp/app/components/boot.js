// 
// index.ios.js
// ==
// @author mengqingshen_sean@outlook.com
// 

// 原生模块
import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Dimensions
} from 'react-native' 

const { width, height } = Dimensions.get('window')

const styles = StyleSheet.create({
  bootPage: {
    width,
    height,
    backgroundColor: '#fff',
    justifyContent: 'center'
  }
})

const Boot = () => (
  <View>
    <ActivityIndicator color='#ee735c' />
  </View>
)

export default Boot
