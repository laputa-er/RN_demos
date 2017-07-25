// 
// login.js
// ==
// @author mengqingshen_sean@outlook.com
// 

import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Button from 'react-native-button'

import * as request from '../../common/request'
import config from '../../common/config'
import Popup from '../../components/popup'

import {
	StyleSheet,
	View,
	Text,
	TextInput,
	AlertIOS
} from 'react-native'
import { CountDownText } from 'react-native-sk-countdown'

import { Navigator } from 'react-native-deprecated-custom-components'


export default class Login extends Component {
	constructor(props) {
		super(props)
		this.state = {
			codeSent: false,
			phoneNumber: '',
			verifyCode: '',
			countingDone: false
		}
	}

	_submit() {
		const phoneNumber = this.state.phoneNumber
		const verifyCode = this.state.verifyCode

		if (!phoneNumber || !verifyCode) {
			return AlertIOS.alert('手机号或验证码不能为空!')
		}

		const body = {
			phoneNumber,
			verifyCode
		}

		const verifyURL = config.api.base + config.api.verify

		request.post(verifyURL, body)
			.then(data => {
				if (data && data.success) {
					this.props.afterLogin(data.data)
				}
				else {
					AlertIOS.alert('获取验证码失败，请检查手机号是否正确')
				}
			})
			.catch(err => {
				AlertIOS.alert('获取验证码失败，请检查网路是否良好')
			})
	}

	_sendVerifyCode() {
		const phoneNumber = this.state.phoneNumber
		if (!phoneNumber) {
			return AlertIOS.alert('手机号码不能为空!')
		}

		const body = {
			phoneNumber
		}

		const signupURL = config.api.base + config.api.signup

		request.post(signupURL, body)
			.then(data => {
				if (data && data.success) {
					this._showVerifyCode()
				}
				else {
					AlertIOS.alert('获取验证码失败，请检查手机号是否正确')
				}
			})
			.catch(err => {
				AlertIOS.alert('获取验证码失败，请检查网路是否良好')
			})
	}

	_showVerifyCode() {
		this.setState({
			codeSent: true
		})
	}

	_countingDown() {
		this.setState({
			countingDone: true
		})
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.signupBox}>
					<Text style={styles.title}>快速登录</Text>
					<TextInput
						placeholder='输入手机号'
						autoCaptialize={'none'}
						autoCorrect={false}
						keyboardType={'number-pad'}
						style={styles.inputFeild}
						onChangeText={text => {
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
									autoCaptialize={'none'}
									autoCorrect={false}
									keyboardType={'number-pad'}
									style={[styles.inputFeild, styles.verifyCodeInputFeild]}
									onChangeText={text => {
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
											countType='seconds'
											auto={true}
											afterEnd={this._countingDown.bind(this)}
											timeLeft={60}
											step={-1}
											startText='获取验证码'
											endText='获取验证码'
											intervalText={sec => '剩余秒数:' + sec}
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
					<Popup {...this.props} />
				</View>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 10,
		backgroundColor: '#f9f9f9',
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
	inputFeild: {
		height: 40,
		padding: 5,
		color: '#666',
		fontSize: 16,
		backgroundColor: '#fff',
		borderRadius: 4
	},
	verifyCodeInputFeild: {
		flex: 1
	},
	btn: {
		marginTop: 10,
		padding: 10,
		backgroundColor: 'transparent',
		borderColor: '#ee735c',
		borderWidth: 1,
		borderRadius: 4,
		color: '#ee735c'
	},
	countBtn: {
		width: 110,
		height: 40,
		padding: 10,
		color: '#fff',
		marginLeft: 8,
		backgroundColor: '#ee735c',
		borderColor: '#ee735c',
		textAlign: 'left',
		fontWeight: '600',
		fontSize: 15,
		borderRadius: 2
	},
	verifyCodeBox: {
		marginTop: 10,
		flexDirection: 'row',
		justifyContent: 'space-between'
	}
})