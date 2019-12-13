import React, { Component } from 'react';
import { View,Image,Text} from 'react-native';
import {
  Button as NbButton
} from 'native-base';
import imgSite from '../../assets/index';
import style from '../../assets/styles/pages/user/userCenter';
import globalVar from '../../utils/globalVar';
import ListItem from '../../components/user/ListItem';

export default class UserCenter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchFlagList: []
    };
  }

  componentWillUnmount(){
    clearTimeout(this.time1);
  }

  logout(){
    this.time1 = setTimeout(()=>{
      this.props.navigation.navigate('LoginPage');
    },100);
  }

  render() {
    return (
      <View style={style.main}>
        <View style={style.userMain}>
          <Image
              source={imgSite.userAvatar}
              style={style.userAvatar}
          />
          <View style={style.userFont}>
            <Text style={style.userFont1}>{globalVar.name}</Text>
            <Text style={style.userFont2}>{globalVar.sex}</Text>
          </View> 
        </View>
        <ListItem />
        <View style={style.logoutView}>
          <NbButton 
              style={style.logoutBtn}
              onPress={() => this.logout()}
          >
          <Text style={style.logoutText}>退出</Text>
          </NbButton>
        </View>
      </View>
    );
  }
}