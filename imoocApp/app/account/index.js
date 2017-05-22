/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

import {
  AsyncStorage,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native' 
const width = Dimensions.get('window').width


export default class Account extends Component {
  constructor(props) {
    super(props)
    let user = props.user || {}
    this.state = {
      user
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('user')
      .then(data => {
        if (data) {
          user = JSON.parse(data)
        }
        console.log(user)
        if (user && user.accessToken) {
          this.setState({
            user
          })
        }
      })
  }

  render() {
    const user = this.state.user
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>我的账户</Text>
        </View>

        {
          user.avatar
          ? <TouchableOpacity style={styles.avatarContainer}>
              <Image
                source={{uri: user.avatar}}
                style={styles.avatarContainer}>
                <View style={styles.abatarBox}>
                  <Image
                    source={{uri: user.avatar}}
                    style={styles.avatar} />
                </View>
                <Text style={styles.avatarTip}>戳这里换头像</Text>
              </Image>
            </TouchableOpacity>
          : <View style={styles.avatarContainer}>
              <Text style={styles.avatarTip}>添加狗狗头像</Text>
              <TouchableOpacity style={styles.avatarBox}>
                <Icon
                  name='ios-cloud-upload-outline'
                  style={styles.plusIcon}>
                </Icon>
              </TouchableOpacity>
            </View>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  toolbar: {
    flexDirection: 'row',
    paddingTop: 25,
    paddingBottom: 12,
    backgroundColor: '#ee735c'
  },
  toolbarTitle: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600'
  },
  avatarContainer: {
    width,
    height: 140,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#999'
  },
  avatarBox: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarTip: {
    color: '#fff',
    backgroundColor: 'transparent',
    fontSize: 14
  },
  avatar: {
    marginBottom: 15,
    width: width * 0.2,
    height: width * 0.2,
    resizeMode: 'cover',
    borderRadius: width * 0.1
  },
  plusIcon: {
    padding: 20,
    paddingLeft: 25,
    paddingRight: 25,
    color: '#999',
    fontSize: 24,
    backgroundColor: '#fff',
    borderRadius: 8
  }
})