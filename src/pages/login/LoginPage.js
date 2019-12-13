
import React, { Component } from 'react';
import { 
  Text, 
  View, 
  Image, 
  ImageBackground, 
  TextInput,
  ToastAndroid 
} from 'react-native';
import {
  Button as NbButton,
  Text as NbText,
 } from 'native-base';
import request from '../../utils/request';
import globalVar from '../../utils/globalVar.js';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Spinkit from 'react-native-spinkit';

import imgSite from '../../assets/index';
import style from '../../assets/styles/pages/login/loginPage';

export default class LoginPage extends Component {
  constructor (props) {
    super(props);
    this.uid = '';
    this.password = '';
  }
  handleClick() {
    if (!this.uid || !this.password) {
        // this.uid = '1';
        // this.password = '111';
        ToastAndroid.show('用户名密码不能为空', ToastAndroid.SHORT);
        return;
    }
    let param = {
      uid: this.uid,
      password: this.password
    };
    let options = {
      url: '/getToken',
      method: 'POST',
      data: param,
      tipFlag: true
    };
    request(options).then((res)=> {
      let result = res.data;
      if (result.code === 0) {
        let data = result.data;
        globalVar.token = 'Bearer ' + data.token;
        globalVar.name = data.name;
        globalVar.sex = data.sex;
        this.props.navigation.navigate('Home');
      }else{
        ToastAndroid.show('用户名密码错误', ToastAndroid.SHORT);
      }
    }).catch(()=>{
      ToastAndroid.show('服务器访问出错啦', ToastAndroid.SHORT);
    });
  }

  render() {
    return (
      <View style={style.main}>
        <ImageBackground
            style={style.bg}
            source={imgSite.bg}
        />
        <View>
        <View style={style.head}>
          <Image
              style={style.img}
              source={imgSite.logo}
          />
          <NbText style={style.headText}>云课堂</NbText>
          <NbText style={style.loginText}>Login to your Acount</NbText>
          <Spinkit
              style={style.spinkit}
              isVisible={true}
              size={32}
              type={'Wave'}
              color={'#fff'} 
          />
        </View>
        <View style={style.userPassword}>
          <View style={style.input}>
            <EvilIcons
                name={'user'}
                size={40}
                style={style.icon}
            />
            <TextInput
                style={style.inputBorder}
                placeholder="请输入账号"
                onChangeText={(text) => this.uid = text}
            />
          </View>
          <View style={style.input}>
            <EvilIcons
                name={'lock'}
                size={40}
                style={style.icon}
            />
            <TextInput
                style={style.inputBorder}
                placeholder="请输入密码"
                secureTextEntry
                onChangeText={(text) => this.password = text}
            />
          </View>
        </View>
      </View>
        <View style={style.block}>
          <NbButton
              onPress={() => this.handleClick()}
              style={style.nbButton}
          >
            <NbText style={style.buttonText}>登  录</NbText>
          </NbButton>
          <View style={style.row}>
            <Text style={style.text}>免费注册</Text>
            <Text style={style.text}> | </Text>
            <Text style={style.text}>忘记密码?</Text>
          </View>
        </View>
      </View>
    );
  }
}