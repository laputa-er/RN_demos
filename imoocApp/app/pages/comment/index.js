import React, { Component } from 'react'
import Button from 'react-native-button'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as appActions from '../../actions/app'

import Popup from '../../components/popup'

import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
  TextInput
} from 'react-native'

const { width } = Dimensions.get('window')

class Comment extends Component {
  state = {
    content: ''
  }

  _submit () {
    if (!this.state.content) {
      return this.props.popAlert('呜呜~', '留言不能为空')
    }

    if (this.props.isSending) {
      return this.props.popAlert('呜呜~', '正在评论中！')
    }

    this.props.submit(this.state.content)
  }

  render () {
    return (
      <View style={styles.commentContainer}>
        <View style={styles.commentBox}>
          <View style={styles.comment}>
            <TextInput
              underlineColorAndroid='transparent'
              placeholder='敢不敢评论一个...'
              style={styles.content}
              multiline
              defaultValue={this.state.content}
              onChangeText={(text) => {
                this.setState({
                  content: text
                })
              }}
            />
          </View>
        </View>

        <Button style={styles.submitBtn} onPress={this._submit.bind(this)}>评论</Button>
        <Popup {...this.props} />
      </View>
    )
  }
}

function mapStateToProps (state) {
  return {
    popup: state.get('app').popup
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(appActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment)

const styles = StyleSheet.create({
  commentContainer: {
    flex: 1,
    paddingTop: 45,
    backgroundColor: '#fff'
  },

  submitBtn: {
    width: width - 20,
    padding: 16,
    marginTop: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ee753c',
    alignSelf: 'center',
    fontSize: 18,
    color: '#ee753c',
    ...Platform.select({
      ios: {
        borderRadius: 4,
      },
      android: {
        borderRadius: 0
      }
    })
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: 64,
    paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    backgroundColor: '#fff'
  },

  commentBox: {
    marginTop: 10,
    marginBottom: 10,
    padding: 8,
    width: width
  },

  content: {
    paddingLeft: 4,
    color: '#333',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    fontSize: 14,
    height: 80
  },

  commentArea: {
    width: width,
    paddingBottom: 6,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  }
})
