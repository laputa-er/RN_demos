import PropTypes from 'prop-types'
import Button from 'react-native-button'
import { CountDownText } from 'react-native-sk-countdown'
import request from '../../common/request'
import config from '../../common/config'
import Popup from '../../components/popup'

import React from 'react'
import {
  StyleSheet,
  Text,
  Platform,
  View,
  TextInput,
  Dimensions,
} from 'react-native'

const {width} = Dimensions.get('window')

export default class Login extends React.Component {
  static propTypes = {
    popAlert: PropTypes.func,
    afterLogin: PropTypes.func
  }
  constructor (props) {
    super(props)

    this.state = {
      pop: null,
      verifyCode: '',
      phoneNumber: '',
      countingDone: false,
      codeSent: false
    }
  }

  _showVerifyCode () {
    this.setState({
      codeSent: true
    })
  }

  _countingDone () {
    this.setState({
      countingDone: true
    })
  }

  _sendVerifyCode () {
    const phoneNumber = this.state.phoneNumber

    if (!phoneNumber) {
      return this.props.popAlert('呜呜~', '手机号不能为空！')
    }

    let body = {
      phoneNumber: phoneNumber
    }

    const signupURL = config.api.signup

    request.post(signupURL, body)
      .then((data) => {
        if (data && data.success) {
          this._showVerifyCode()
        } else {
          this.props.popAlert('呜呜~', '获取验证码失败，请检查手机号是否正确')
        }
      })
      .catch((err) => {
        this.props.popAlert('呜呜~', '获取验证码失败，请检查网络是否良好', err)
      })
  }

  _submit () {
    const phoneNumber = this.state.phoneNumber
    const verifyCode = this.state.verifyCode

    if (!phoneNumber || !verifyCode) {
      return this.props.popAlert('呜呜~', '手机号或验证码不能为空！')
    }

    let body = {
      phoneNumber: phoneNumber,
      verifyCode: verifyCode
    }

    const verifyURL = config.api.verify

    request.post(verifyURL, body)
      .then((data) => {
        if (data && data.success) {
          this.props.afterLogin(data.data)
        } else {
          this.props.popAlert('呜呜~', '获取验证码失败，请检查手机号是否正确')
        }
      })
      .catch((err) => {
        this.props.popAlert('呜呜~', '获取验证码失败，请检查网络是否良好', err)
      })
  }

  _alert (title, content) {
    this.setState({
      pop: {
        title: title,
        content: content
      }
    }, () => {
      setTimeout(() => {
        this.setState({
          pop: null
        })
      }, 1500)
    })
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={styles.signupBox}>
          <Text style={styles.title}>快速登录</Text>
          <TextInput
            placeholder='输入手机号'
            autoCaptialize={'none'}
            autoCorrect={false}
            keyboardType={'number-pad'}
            style={styles.inputField}
            underlineColorAndroid='transparent'
            onChangeText={(text) => {
              this.setState({
                phoneNumber: text
              })
            }}
          />

          {
            this.state.codeSent
              ? <View style={styles.verifyCodeBox}>
                <TextInput
                  placeholder='输入验证码'
                  underlineColorAndroid='transparent'
                  autoCaptialize={'none'}
                  autoCorrect={false}
                  keyboardType={'number-pad'}
                  style={[styles.inputField, styles.verifyField]}
                  onChangeText={(text) => {
                    this.setState({
                      verifyCode: text
                    })
                  }}
                />

                {
                  this.state.countingDone
                    ? <Button
                      style={styles.countBtn}
                      onPress={this._sendVerifyCode.bind(this)}>获取验证码</Button>
                    : <CountDownText
                      style={styles.countBtn}
                      countType='seconds' // 计时类型：seconds / date
                      auto // 自动开始
                      afterEnd={this._countingDone.bind(this)} // 结束回调
                      timeLeft={60} // 正向计时 时间起点为0秒
                      step={-1} // 计时步长，以秒为单位，正数则为正计时，负数为倒计时
                      startText='获取验证码' // 开始的文本
                      endText='获取验证码' // 结束的文本
                      intervalText={(sec) => '剩余秒数:' + sec} // 定时的文本回调
                    />

                }
              </View>
              : null
          }

          {
            this.state.codeSent
              ? <Button
                style={styles.btn}
                onPress={this._submit.bind(this)}>登录</Button>
              : <Button
                style={styles.btn}
                onPress={this._sendVerifyCode.bind(this)}>获取验证码</Button>
          }
        </View>
        <Popup {...this.props} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f9f9f9'
  },

  signupBox: {
    marginTop: 30
  },

  title: {
    marginBottom: 20,
    color: '#333',
    fontSize: 20,
    textAlign: 'center'
  },

  inputField: {
    height: 40,
    padding: 5,
    color: '#666',
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 4
  },

  verifyField: {
    width: width - 140
  },

  verifyCodeBox: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  countBtn: {
    width: 110,
    height: 40,
    padding: 10,
    marginLeft: 8,
    backgroundColor: '#ee735c',
    borderColor: '#ee735c',
    color: '#fff',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: 15,
    borderRadius: 2
  },

  btn: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'transparent',
    borderColor: '#ee735c',
    borderWidth: 1,
    ...Platform.select({
      ios: {
        borderRadius: 4,
      },
      android: {
        borderRadius: 0
      }
    }),
    color: '#ee735c'
  }
})
