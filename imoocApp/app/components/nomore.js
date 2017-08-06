import React from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'

const styles = StyleSheet.create({
  loadingMore: {
    marginVertical: 20
  },

  loadingText: {
    color: '#777',
    textAlign: 'center'
  }
})

const NoMore = () => (
  <View style={styles.loadingMore}>
    <Text style={styles.loadingText}>没有更多了</Text>
  </View>
)

export default NoMore