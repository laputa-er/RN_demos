/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
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
  AlertIOS
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
      avatarUploading: false
    }
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
              AsyncStorage.setItem('user', JSON.stringify(user))
            })
          }
        })
    }
  }

  render() {
    const user = this.state.user
    return (
      <View style={styles.container}>
        <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>狗狗的账户</Text>
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