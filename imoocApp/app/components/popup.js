import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  Text,
  Dimensions,
  View
} from 'react-native'

const {width, height} = Dimensions.get('window')

export default class Popup extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const {
      popup
    } = this.props

    if (!popup || (!popup.title && !popup.content)) {
      return null
    }

    return (
      <View style={styles.popupContainer}>
        <View style={styles.tipBoxView}>
          <View style={styles.tipBox}>
            {
              popup.title ? <View style={styles.tipTitleBox}>
                <Text style={styles.tipTitle}>{popup.title}</Text>
              </View>
              : null
            }
            {
              popup.content ? <View style={styles.tipContentBox}>
                <Text style={styles.tipContent}>{popup.content}</Text>
              </View>
              : null
            }
          </View>
        </View>
      </View>
    )
  }
}

let styles = StyleSheet.create({
  popupContainer: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: width,
    height: height,
    overflow: 'hidden',
    backgroundColor: 'rgba(0, 0, 0, 0.3)'
  },

  tipBoxView: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 50,
    borderRadius: 12
  },

  tipBox: {
    paddingTop: 15,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },

  tipTitleBox: {
    height: 30,
    width: width - 50,
    justifyContent: 'center',
    alignItems: 'center'
  },

  tipTitle: {
    fontSize: 19,
    fontWeight: '500',
    textAlign: 'center'
  },

  tipContentBox: {
    flexDirection: 'column',
    marginBottom: 15,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  tipContent: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center'
  }
})
