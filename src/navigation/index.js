import { 
  createStackNavigator, 
  createBottomTabNavigator, 
  createSwitchNavigator, 
  createAppContainer 
} from 'react-navigation';
import { Image } from 'react-native';
import React from 'react';
import baseStyle from './baseStyle';
import tab from '../assets/styles/pages/test/tab';
import imgSite from '../assets/index';
import Test from './test/test';
import ExamList from './exam/examList';
import Video from './video/audio';

import LoginPage from '../pages/login/LoginPage';
import HomePage from '../pages/HomePage';
import Search from '../pages/user/Search';
import NetDisk from '../pages/netDisk/NetDisk';
import UserCenter from '../pages/user/UserCenter';

var commonCreateTabStack = (Page, title, activeImg, img) => {
  const commonStack = createStackNavigator({
    tempTab: {
      screen: Page,
      navigationOptions: {
        headerTitle: title
      }
    }
  },
    Object.assign({}, baseStyle)
  );

  const commonTab = {
    screen: commonStack,
    navigationOptions: {
      title: title,
      // eslint-disable-next-line react/display-name
      tabBarIcon: ({focused }) =>
        <Image source={focused ? activeImg : img}
            style={tab.imgSize}
        />
    }
  };
  return commonTab;
};

const TabNavigator = createBottomTabNavigator({
  Tab1: commonCreateTabStack(HomePage, '主页', imgSite.activeicon_home, imgSite.icon_home),
  Tab2: commonCreateTabStack(Search, '搜索', imgSite.activeicon_recommend, imgSite.icon_recommend),
  Tab3: commonCreateTabStack(NetDisk, '网盘', imgSite.activeicon_message, imgSite.icon_message),
  Tab4: commonCreateTabStack(UserCenter, '我的', imgSite.activeicon_me, imgSite.icon_me),

});

const HomeStackNavigator = createStackNavigator({
  HomePage: {
    screen: TabNavigator,
    title: '主界面',
    navigationOptions: {
      header: null
    }
  },
  ...Test,
  // 试题
  ...ExamList,
  // 网盘

  // 视听
  ...Video
},
  Object.assign({}, baseStyle)
);

const AppNavigator = createSwitchNavigator({
  LoginPage: { screen: LoginPage, title: '登录页面' },
  Home: HomeStackNavigator,
},
  Object.assign({}, { initialRouteName: 'LoginPage' }, baseStyle)
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;