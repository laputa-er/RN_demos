/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import Button from 'react-native-button'
import ImagePicker from 'react-native-image-picker'
import sha1 from 'sha1'
import * as Progress from 'react-native-progress'

import * as request from '../common/request'
import config from '../common/config'

import {
  AsyncStorage,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  AlertIOS,
  Modal,
  TextInput
} from 'react-native' 
const width = Dimensions.get('window').width
const photoOptions = {
  title: '选择头像',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍照',
  chooseFromLibraryButtonTitle: '选择相册',
  quality: 0.75,
  noData: false,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

const CLOUDINARY = {
  cloud_name: 'dox3udxny',
  api_key: '933482656862456',
  api_secret: 'iKxq6NKzzog-a2VvEOUo54H-IKA',
  base: 'http://res.cloudinary.com/dox3udxny',
  image: 'https://api.cloudinary.com/v1_1/dox3udxny/image/upload',
  video: 'https://api.cloudinary.com/v1_1/dox3udxny/video/upload',
  audio: 'https://api.cloudinary.com/v1_1/dox3udxny/audio/upload'
}

function avatar(id, type) {
  if (id.indexOf('http') > -1) {
    return id
  }
  if (id.indexOf('data:image') > -1) {
    return id
  }
  return CLOUDINARY.base + '/' + type + '/upload/' + id
}

export default class Account extends Component {
  constructor(props) {
    super(props)
    let user = props.user || {}
    this.state = {
      user,
      avatarProgress: 0,
      avatarUploading: false,
      modalVisible: false
    }
  }

  _edit() {
    this.setState({ modalVisible: true })
  }
  _closeModal() {
    this.setState({ modalVisible: false })
  }

  componentDidMount() {
    AsyncStorage.getItem('user')
      .then(data => {
        if (data) {
          user = JSON.parse(data)
        }
        if (user && user.accessToken) {
          this.setState({
            user
          })
        }
      })
  }

  _pickPhoto() {
    ImagePicker.showImagePicker(photoOptions, res => {
      if (res.didCancel) {
        return
      }
      const avatarData = 'data:image/jpeg;base64,' + res.data
      const timestamp = Date.now()
      const tags = 'app,avatar'
      const folder = 'avatar'
      const signatureURL = config.api.base + config.api.signature
      const accessToken = this.state.user.accessToken

      request.post(signatureURL, {
        accessToken,
        timestamp,
        folder,
        tags,
        type: 'avatar'
      })
      .catch(err => {
        console.log(err)
      })
      .then(data => {
        console.log(data)
        if (data && data.success) {
          let signature = 'folder=' + folder
                        + '&tags=' + tags
                        + '&timestamp=' +  timestamp + CLOUDINARY.api_secret

          signature = sha1(signature)
          
          const body = new FormData()

          body.append('folder', folder)
          body.append('signature', signature)
          body.append('timestamp', timestamp)
          body.append('tags', tags)
          body.append('api_key', CLOUDINARY.api_key)
          body.append('resource_type', 'image')
          body.append('file', avatarData)

          this._upload(body)
        }
      })
      
    })
  }

  _upload(body) {
    const xhr = new XMLHttpRequest()
    const url = CLOUDINARY.image

    this.setState({
      avatarProgress: 0,
      avatarUploading: true
    })

    xhr.open('POST', url)
    xhr.onload = () => {
      if (xhr.status !== 200) {
        AlertIOS.alert('请求失败')
        console.log(xhr.responseText)
        return
      }

      if (!xhr.responseText) {
        AlertIOS.alert('请求失败')
        return
      }

      let response
      try {
        response = JSON.parse(xhr.response)
      }
      catch (e) {
        console.log(e)
        console.log('parse fails')
      }

      if (response && response.public_id) {
        const user = this.state.user
        user.avatar = response.public_id
        this.setState({
          avatarUploading: false,
          avatarProgress: 0,
          user
        })

        this._asyncUser(true)
      }
    }
    
    // 获取图片上传进度
    if (xhr.upload) {
      xhr.upload.onprogress = event => {
        if (event.lengthComputable) {
          const percent = Number((event.loaded / event.total).toFixed(2))
          this.setState({
            avatarProgress: percent
          })
        }
      }
    }
    xhr.send(body)
  }

  // 将用户的当前信息同步到服务器
  _asyncUser(isAvatar) {
    const user = this.state.user
    if (user && user.accessToken) {
      const url = config.api.base + config.api.update
      request.post(url, user)
        .then(data => {
          if (data && data.success) {
            const user = data.data
            if (isAvatar) { AlertIOS.alert('头像更新成功') }
            this.setState({ user }, () => {
              this._closeModal()
              AsyncStorage.setItem('user', JSON.stringify(user))
            })
          }
        })
    }
  }

  _changeUserState(key, value) {
    const user = this.state.user

    user[key] = value

    this.setState({ user })
  }
  
  _submit() {
    const user = this.state.user
    this._asyncUser()
  }

  _logout() {
    this.props.logout()
  }

  render() {
    const user = this.state.user
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>狗狗的账户</Text>
          <TouchableOpacity onPress={this._edit.bind(this)}>
            <Text style={styles.toolbarExtra}>编辑</Text>
          </TouchableOpacity>
        </View>

        {
          user.avatar
          ? <TouchableOpacity
              onPress={this._pickPhoto.bind(this)}
              style={styles.avatarContainer}>
              <Image
                source={{uri: avatar(user.avatar, 'image')}}
                style={styles.avatarContainer}>
                <View style={styles.abatarBox}>
                  {
                    this.state.avatarUploading
                    ? <Progress.Circle
                        showText={true}
                        size={75}
                        color={'#ee735c'}
                        progress={this.state.avatarProgress} />
                    : <Image
                        source={{uri: avatar(user.avatar, 'image')}}
                        style={styles.avatar} />
                  }
                </View>
                <Text style={styles.avatarTip}>戳这里换头像</Text>
              </Image>
            </TouchableOpacity>
          : <TouchableOpacity
              onPress={this._pickPhoto.bind(this)}
              style={styles.avatarContainer}>
              <Text style={styles.avatarTip}>添加狗狗头像</Text>
              <View style={styles.avatarBox}>
                {
                  this.state.avatarUploading
                  ? <Progress.Circle
                      showText={true}
                      size={75}
                      color={'#ee735c'}
                      progress={this.state.avatarProgress} />
                  : <Icon
                      name='ios-cloud-upload-outline'
                      style={styles.plusIcon} />
                }
              </View>
            </TouchableOpacity>
        }
        <Modal
          animationType={'fade'}
          visible={this.state.modalVisible}>
          <View style={styles.modalContainer}>
            <Icon
              name='ios-close-outline'
              style={styles.closeIcon}
              onPress={this._closeModal.bind(this)}/>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>昵称</Text>
              <TextInput
                placeholder={'狗狗的昵称'}
                style={styles.inputField}
                autoCapitalize={'none'}
                autoCorrect={false}
                defaultValue={user.nickname}
                onChangeText={text => {
                  this._changeUserState('nickname', text)
                }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>品种</Text>
              <TextInput
                placeholder={'狗狗的品种'}
                style={styles.inputField}
                autoCapitalize={'none'}
                autoCorrect={false}
                defaultValue={user.breed}
                onChangeText={text => {
                  this._changeUserState('breed', text)
                }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>年龄</Text>
              <TextInput
                placeholder={'狗狗的年龄'}
                style={styles.inputField}
                autoCapitalize={'none'}
                autoCorrect={false}
                defaultValue={user.age}
                onChangeText={text => {
                  this._changeUserState('age', text)
                }}
              />
            </View>
            <View style={styles.fieldItem}>
              <Text style={styles.label}>性别</Text>
              <Icon.Button
                onPress={() => {
                  this._changeUserState('gender', 'male')
                }}
                style={[
                  styles.gender,
                  user.gender === 'male' && styles.genderChecked
                ]}
                name='ios-paw'>男</Icon.Button>
              <Icon.Button
                onPress={() => {
                  this._changeUserState('gender', 'female')
                }}
                style={[
                  styles.gender,
                  user.gender === 'female' && styles.genderChecked
                ]}
                name='ios-paw-outline'>女</Icon.Button>
            </View>
            <Button
								style={styles.btn}
								onPress={this._submit.bind(this)}>登录</Button>
          </View>
        </Modal>
        <Button
            style={styles.btn}
            onPress={this._logout.bind(this)}>退出登录</Button>
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
  toolbarExtra: {
    position: 'absolute',
    right: 10,
    top: 0,
    color: '#fff',
    textAlign: 'right',
    fontWeight: '600',
    fontSize: 14
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
  },
  modalContainer: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff'
  },
  fieldItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    paddingLeft: 15,
    borderColor: '#eee',
    borderBottomWidth: 1
  },
  label: {
    color: '#ccc',
    marginRight: 10
  },
  inputField: {
    flex: 1,
    height: 50,
    color: '#666',
    fontSize: 14
  },
  closeIcon: {
    position: 'absolute',
    width: 40,
    height: 40,
    fontSize: 32,
    right: 20,
    top: 30,
    color: '#ee735c'
  },
  gender: {
    backgroundColor: '#ccc'
  },
  genderChecked: {
    backgroundColor: '#ee735c'
  },
	btn: {
		marginTop: 25,
    marginLeft: 10,
    marginRight: 10,
		padding: 10,
		backgroundColor: 'transparent',
		borderColor: '#ee735c',
		borderWidth: 1,
		borderRadius: 4,
		color: '#ee735c'
	}
})