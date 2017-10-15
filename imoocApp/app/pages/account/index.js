import React from 'react'
import PropTypes from 'prop-types'
import * as util from '../../common/util'
import Button from 'react-native-button'

import {
  StyleSheet,
  Text,
  Platform,
  View,
  Image
} from 'react-native'

export default class Account extends React.Component {
  static propTypes = {
    user: PropTypes.object,
    navigation: PropTypes.any,
    logout: PropTypes.func
  }
  render () {
    const user = this.props.user

    return (
      <View style={styles.container}>
        <View style={styles.fieldItem}>
          <Text style={styles.label}>头像</Text>
          <View style={styles.avatarBox}>
            <Image
              source={{uri: util.avatar(user.avatar, 'image')}}
              style={styles.avatar} />
          </View>
        </View>
        <View style={styles.fieldItem}>
          <Text style={styles.label}>昵称</Text>
          <Text style={styles.content}>{user.nickname}</Text>
        </View>
        <View style={styles.fieldItem}>
          <Text style={styles.label}>品种</Text>
          <Text style={styles.content}>{user.breed}</Text>
        </View>
        <View style={styles.fieldItem}>
          <Text style={styles.label}>年龄</Text>
          <Text style={styles.content}>{user.age}</Text>
        </View>
        <View style={styles.fieldItem}>
          <Text style={styles.label}>性别</Text>
          {user.gender === 'male' && <Text style={styles.content}>男</Text>}
          {user.gender === 'female' && <Text style={styles.content}>女</Text>}
        </View>

        {
          Platform.OS === 'android' && <Button
            style={styles.btn}
            onPress={() => this.props.navigation.navigate('AccountUpdate')}>编辑资料</Button>
        }

        <Button
          style={[styles.btn, styles.normalBtn]}
          onPress={() => this.props.logout()}>退出登录</Button>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff'
  },

  avatarBox: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center'
  },

  avatar: {
    marginBottom: 15,
    width: 40,
    height: 40,
    resizeMode: 'cover',
    borderColor: '#f9f9f9',
    borderWidth: 1,
    borderRadius: 20
  },

  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingLeft: 15,
    paddingRight: 15,
    borderColor: '#eee',
    borderBottomWidth: 1
  },

  label: {
    textAlign: 'left',
    color: '#999',
    marginRight: 10
  },

  content: {
    textAlign: 'right',
    color: '#555'
  },

  btn: {
    marginTop: 25,
    padding: 10,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: 'transparent',
    borderColor: '#ee735c',
    borderWidth: 1,
    color: '#ee735c',
    ...Platform.select({
      ios: {
        borderRadius: 4
      },
      android: {
        borderRadius: 0
      }
    })
  },

  normalBtn: {
    borderColor: '#ccc',
    color: '#ccc'
  }
})