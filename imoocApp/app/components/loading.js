import React from 'react'
import {
  StyleSheet,
  ActivityIndicator,
} from 'react-native'

const styles = StyleSheet.create({
  loading: {
    marginVertical: 20
  }
})

const Loading = () => (
  <ActivityIndicator style={styles.loading} />
)

export default Loading