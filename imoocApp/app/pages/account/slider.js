import React from 'react'
import PropTypes from 'prop-types'
import {
  Text,
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} from 'react-native'
import Swiper from 'react-native-swiper'
import Button from 'react-native-button'

const { width, height } = Dimensions.get('window')


export default class Slider extends React.Component {
 static propTypes = {
   enterSlide: PropTypes.func
 };
 state = {
   loop: false,
   banners: [
     require('../assets/images/s1.jpg'),
     require('../assets/images/s2.jpg'),
     require('../assets/images/s3.jpg')
   ]
 }
 _enter () {
   this.props.enterSlide()
 }
 render () {
   return (
     <Swiper
       showsPagination={true}
       dot={<View style={styles.dot} />}
       activeDot={<View style={styles.activeDot} />}
       paginationStyle={styles.pagination}
       loop={this.state.loop}
     >
       {
         this.state.banners.map((banner, index, banners) => {
           return (
             <View style={styles.slide} key={'banner' + index}>
               <Image style={styles.image} source={banner}>
                 {
                   index === banners.length - 1
                     ? <TouchableHighlight style={styles.btn} onPress={this._enter.bind(this)}>
                       <Text style={styles.btnText}>马上体验</Text>
                     </TouchableHighlight>
                     : null
                 }
               </Image>
             </View>
           )
         })
       }
     </Swiper>
   )
 }
}

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    width,
  },

  image: {
    flex: 1,
    width,
    height
  },

  dot: {
    width: 14,
    height: 14,
    backgroundColor: 'transparent',
    borderColor: '#ff6600',
    borderRadius: 7,
    borderWidth: 1,
    marginLeft: 12,
    marginRight: 12
  },

  activeDot: {
    width: 14,
    height: 14,
    borderWidth: 1,
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 7,
    borderColor: '#ee735c',
    backgroundColor: '#ee735c',
  },

  pagination: {
    bottom: 30
  },

  btn: {
    position: 'absolute',
    width: width - 20,
    left: 10,
    bottom: 60,
    height: 50,
    padding: 15,
    backgroundColor: '#ee735c',
    borderColor: '#ee735c',
    borderWidth: 1,
    borderRadius: 3
  },

  btnText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center'
  }
})