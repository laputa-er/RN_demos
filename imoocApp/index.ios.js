/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native' 

class Son extends Component{
  constructor(props) {
    super(props)
    this.state = {
      times: this.props.times
    }
  }
  timesPlus() {
    let times = this.state.times
    times++
    this.setState({ times })
  }
  timesReset() {
    this.props.timesReset()
  }
  
  componentWillMount() {
    console.log('son', 'componentWillMount')
  }
  componentDidMount() {
    console.log('son', 'componentDidMount')
  }
  componentWillReceiveProps(props) {
    console.log('son', 'componentWillReceiveProps')
    this.setState({
      times: props.times
    })
  }
  shouldComponentUpdate() {
    console.log('son', 'shouldComponentUpdate')
    return true
  }
  componentWillUpdate() {
    console.log('son', 'componentWillUpdate')
  }
  componentDidUpdate() {
    console.log('son', 'componentDidUpdate')
  }
  componentWillUmount() {
    console.log('son', 'componentWillUmount')
  }
  render() {
    console.log('son', 'render')
    return (
      <View style={styles.container}>
        <Text style={styles.welcome} onPress={this.timesPlus.bind(this)}>
          有本事揍我啊
        </Text>
        <Text style={styles.instructions}>
          你居然揍了我 {this.state.times} 次
        </Text>
        <Text style={styles.instructions} onPress={this.timesReset.bind(this)}>
          信不信我亲亲你
        </Text>
      </View>
    )
  }
}

class imoocApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hit: false,
      times: 2
    }
  }
  
  timesPlus() {
    let times = this.state.times
    times += 3
    this.setState({ times })
  }
  timesReset() {
    this.setState({ times: 0 })
  }
  willHit() {
    this.setState({
      hit: !this.state.hit
    })
  }
  componentWillMount() {
    console.log('father', 'componentWillMount')
  }
  componentDidMount() {
    console.log('father', 'componentDidMount')
  }
  shouldComponentUpdate() {
    console.log('father', 'shouldComponentUpdate')
    return true
  }
  componentWillUpdate() {
    console.log('father', 'componentWillUpdate')
  }
  componentDidUpdate() {
    console.log('father', 'componentDidUpdate')
  }
  render() {
    console.log('father', 'render')
    return (
      <View style={styles.container}>
        {
          this.state.hit
          ? <Son times={this.state.times} timesReset={this.timesReset.bind(this)}/>
          : null
        }
        <Text style={styles.welcome} onPress={this.timesReset.bind(this)}>
          老子说: 心情好就放你一马
        </Text>
        <Text style={styles.instructions} onPress={this.willHit.bind(this)}>
          到底揍不揍
        </Text>
        <Text style={styles.instructions}>
          就揍了你 {this.state.times} 次而已
        </Text>
        <Text style={styles.instructions} onPress={this.timesPlus.bind(this)}>
          不听话再揍你 3 次
        </Text>
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
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  }
})

AppRegistry.registerComponent('imoocApp', () => imoocApp)
