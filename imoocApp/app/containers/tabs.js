import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'
import List from './creation'

import {
  Button,
  Text,
  View,
} from 'react-native'

import {
  TabNavigator,
  StackNavigator
} from 'react-navigation'

const InnerScreen = ({navigation, desc}) => (
  <View style={{marginTop: 20}}>
    <Text style={{textAlign: 'center', color: '#f60'}}>{desc}</Text>
    <Button
      onPress={() => navigation.navigate('Detail', {
        name: 'Scott'
      })}
      title='列表页：点击前往详情页' />
    <Button
      onPress={() => navigation.navigate('Comment', {
        name: 'Sean'
      })}
      title='列表页：点击前往评论页' />
    <Button
      onPress={() => navigation.navigate('Edit', {
        name: 'Sean'
      })}
      title='账户页：点击前往编辑页' />
    <Button
      onPress={() => navigation.navigate('Account')}
      title='账户页：点击前往账户页' />
    <Button
      onPress={() => navigation.goBack(null)}
      title='返回上一个页面' />
  </View>
)

const ListScreen = ({navigation}) => (
  <InnerScreen desc='当前是列表页' navigation={navigation} />
)

const EditScreen = ({navigation}) => (
  <InnerScreen desc='当前是编辑页' navigation={navigation} />
)

const AccountScreen = ({navigation}) => (
  <InnerScreen desc='当前是账户页' navigation={navigation} />
)

const CommentScreen = ({navigation}) => (
  <InnerScreen desc='当前是评论页' navigation={navigation} />
)

const AccountUpdateScreen = ({navigation}) => (
  <InnerScreen desc='当前是账户更新页' navigation={navigation} />
)

const DetailScreen = ({navigation}) => (
  <InnerScreen
    desc={`${navigation.state.params.name} 的咆哮`}
    navigation={navigation} />
)

const headerStyle = {
  height: 52,
  paddingTop: 14,
  backgroundColor: '#ee735c'
}

const ListTab = StackNavigator({
  List: {
    screen: List,
    navigationOptions: {
      headerTitle: '狗狗说',
      headerStyle,
      headerTintColor: '#fff',
      tabBarIcon: ({tintColor, focused}) => (
        <Icon
          name={focused ? 'ios-videocam' : 'ios-videocam-outline'}
          color={tintColor}
          size={28} />
      )
    }
  },
  Detail: {
    screen: DetailScreen,
    navigationOptions: ({navigation}) => ({
      headerTitle: `${navigation.state.params.name} 的创意`,
      headerStyle,
      headerTintColor: '#fff',
      tabBarVisible: false
    })
  },
  Comment: {
    screen: CommentScreen,
    navigationOptions: () => ({
      title: '评论',
      headerStyle: headerStyle[Platform.OS],
      headerTintColor: '#fff',
      tabBarVisible: Platform.OS === 'android',
      tabBarIcon: ({tintColor, focused}) => (
        <Icon
          name={focused ? 'ios-videocam' : 'ios-videocam-outline'}
          color={tintColor}
          size={28}
        />
      )
    })
  }
})

const AccountTab = StackNavigator({
  Account: {
    screen: AccountScreen,
    navigationOptions: ({navigation}) => ({
      headerTitle: '狗狗的账户',
      headerStyle,
      headerTintColor: '#fff',
      headerRight: (
        <Text style={{color: '#fff', paddingRight: 10}} onPress={() => navigation.navigate('AccountUpdate')}>编辑</Text>
      ),
      tabBarIcon: ({tintColor, focused}) => (
        <Icon
          name={focused ? 'ios-more' : 'ios-more-outline'}
          color={tintColor}
          size={28} />
      )
    })
  },
  AccountUpdate: {
    screen: AccountUpdateScreen,
    navigationOptions: {
      headerTitle: '更新资料',
      headerStyle,
      headerTintColor: '#fff',
      tabBarVisible: false
    }
  },
  Edit: {
    screen: EditScreen,
    navigationOptions: {
      headerTitle: '更新资料',
      headerStyle,
      headerTintColor: '#fff',
      tabBarVisible: false
    }
  },

})

const Tabs = TabNavigator({
  ListTab: {
    screen: ListTab,
    navigationOptions: {
      tabBarLable: '狗狗说'
    }
  },
  EditTab: {
    screen: EditScreen,
    title: '理解狗狗，从配音开始',
    navigationOptions: {
      headerTitle: '编辑视频',
      headerStyle,
      headerTintColor: '#fff',
      tabBarIcon: ({tintColor, focused}) => (
        <Icon
          name={focused ? 'ios-recording' : 'ios-recording-outline'}
          color={tintColor}
          size={28} />
      )
    }
  },
  AccountTab: {
    screen: AccountTab
  }
}, {
  tabBarPosition: 'bottom',
  lazyload: true,
  tabBarOptions: {
    activeTintColor: '#ee735c',
    inactiveTintColor: '#666',
    // showIcon: true,
    // showLabel: false,
    labelStyle: {
      fontSize: 12
    },
    style: {
      borderTopWidth: 1,
      borderTopColor: '#f1f1f1',
      backgroundColor: '#fff'
    }
  }
})

export default Tabs