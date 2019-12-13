import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  Switch,
  ToastAndroid,
  Linking,
  NativeModules,
  PermissionsAndroid,
  Platform,
  TouchableOpacity
} from 'react-native';
import {
  Icon as NbIcon
} from 'native-base';
import imgSite from '../../assets/index';
import style from '../../assets/styles/components/listItem';
import CONSTANT from '../../utils/constant';
import RNFetchBlob from 'rn-fetch-blob';
import Dialog from '../Dialog';
var packageJson = require('../../../app.json');
import request from '../../utils/request';

export default class ListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      switchList: [
        { imgPath: imgSite.springLeaves, textContent: '给客服打电话', icon: 'switch' },
        { imgPath: imgSite.branch, textContent: '给客服发短信', icon: 'switch' },
        { imgPath: imgSite.aloeVera, textContent: '获取位置信息', icon: 'switch' },
        { imgPath: imgSite.mushroom, textContent: '关于', icon: 'arrow' },
      ],
      switchFlagList: [],
      versionVisible: false,
      upgradeVisible: false,
      newVersion: false,
    };
    this.versionInfo = {};
    this.newVersionInfo = {};
  }

  componentDidMount() {
    this.getVersionInfo();
    this.getNewVersionInfo();
    let webSocket = new WebSocket(CONSTANT.SOCKET_WS);
    webSocket.onmessage = (e) => {
      this.newVersionInfo = JSON.parse(e.data);
      this.setState({
        upgradeVisible: true
      });
      this.changeSwitch();
    };
  }


  switchValueChange(index, flag) {
    let switchFlagList = this.state.switchFlagList;
    switchFlagList[index] = !switchFlagList[index];
    this.setState({
      switchFlagList: switchFlagList
    });
    if (flag) {
      switch (index) {
        case 0:
          this.call(1);
          break;
        case 1:
          this.call(2);
          break;
        case 2:
          this.getLocation();
          break;
      }
    }
  }

  // 拨打电话功能 or 短信功能
  call(flag) {
    let tel = flag === 1 ? 'tel:10086' : 'smsto:10086';
    Linking.canOpenURL(tel).then(supported => {
      if (!supported) {
        ToastAndroid.show.show('您未授权通话和短信权限');
      } else {
        return Linking.openURL(tel);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  // 获取位置信息
  getLocation() {
    //返回Promise类型
    const granted = PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    let vm = this;
    granted.then((data) => {
      if (data === false) {
        vm.requestLocationPermission();
      } else {
        vm.showLocation();
      }
    }).catch((err) => {
      console.log(err);
    });
  }

  async requestLocationPermission() {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      this.showLocation();
    }
  }

  // 获取地理位置
  showLocation() {
    NativeModules.LocationModule.getLocation((lat, lng, country, locality) => {
      let str = '获取位置信息失败,您可能手机位置信息没有开启!';
      if (lat && lng) {
        str = country + ',' + locality + ',纬度:' + lat + ',' + '经度:' + lng;
      }
      ToastAndroid.show(str, ToastAndroid.SHORT);
    });
  }

  // 在线升级功能，安卓9.0需要主动要求用户授权SD卡写入权限，否则直接权限报错导致APP奔溃
  initWritePermission = async () => {
    if (Platform.OS == 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.checkUpdate();
      } else {
        ToastAndroid.show.show('您未授权存储访问权限, 无法下载更新文件');
      }
    } else {
      this.checkUpdate();
    }
  };

  checkUpdate = () => {
    const android = RNFetchBlob.android;
    //下载成功后文件所在path
    const downloadDest = `${
      RNFetchBlob.fs.dirs.DownloadDir
      }/app_release.apk`;

    RNFetchBlob.config({
      //配置手机系统通知栏下载文件通知，下载成功后点击通知可运行apk文件
      addAndroidDownloads: {
        useDownloadManager: true,
        title: 'RN APP',
        description: 'An APK that will be installed',
        mime: 'application/vnd.android.package-archive',
        path: downloadDest,
        mediaScannable: true,
        notification: true
      }
    }).fetch(
      'GET',
       CONSTANT.SERVER_URL+'/appVersion/download?path='+this.newVersionInfo.path
    ).then(res => {
      //下载成功后自动打开运行已下载apk文件
      android.actionViewIntent(
        res.path(),
        'application/vnd.android.package-archive'
      );
    });
  }

  // 获取安装的 app 版本信息
  getVersionInfo = () => {
    let data = {
      version: packageJson.version
    };
    let options = {
      url: '/appVersion/get',  // 请求 url
      data: data,
      tipFlag: true, // 默认统一提示，如果需要自定义提示，传入 true
    };
    request(options).then((res) => {
      if (res.status === 200) {
        if (res.data.data.length > 0) {
          this.versionInfo = res.data.data[0];
        }
      }
    });
  }

  // 获取已发布的最新 app 版本信息
  getNewVersionInfo = () => {
    let options = {
      url: '/systemInfo/queryAll',  // 请求 url
      method: 'get',
      tipFlag: true, // 默认统一提示，如果需要自定义提示，传入 true
    };
    request(options).then((res) => {
      if (res.status === 200) {
        this.newVersionInfo = res.data;
        if (this.newVersionInfo.app_version > packageJson.version) {
          this.newVersionInfo.functionDescripe = this.newVersionInfo.function_descripe;
          this.changeSwitch();
        }
      }
    });
  }

  // 有新版本
  changeSwitch() {
    let obj = { imgPath: imgSite.flower, textContent: '版本升级提示', info: true };
    let switchList = this.state.switchList;
    switchList.splice(4,1,obj);
    this.setState({
      switchList: switchList
    });
  }
  // 弹窗显示版本号 or 升级
  handleArrow = (index) => {
    if (index === 3) {
      this.setState({
        versionVisible: true
      });
    } else {
      this.setState({
        upgradeVisible: true
      });
    }
  }

  // 关闭查看版本弹窗
  closeVersion = () => {
    this.setState({
      versionVisible: false
    });
  }

  // 关闭升级弹窗
  closeUpgrade = () => {
    this.setState({
      upgradeVisible: false
    });
  }

  // 开始升级
  appUpgrade = () => {
    this.closeUpgrade();
    this.initWritePermission();
  }

  render() {
    let switchList = this.state.switchList;
    return (
      <View>
        {switchList.map((item, index) => {
          return (
            <View style={style.swtichView} key={index}>
              <Image
                  source={item.imgPath}
                  style={style.switchImg}
              />
              <Text style={style.switchText}>{item.textContent}</Text>
              {
                item.icon === 'switch' &&
                <Switch onValueChange={(flag) => this.switchValueChange(index, flag)}
                    value={this.state.switchFlagList[index]}
                    trackColor={{ true: '#3eb4ff' }}
                    thumbColor={this.state.switchFlagList[index] ? '#3eb4ff' : '#eee'} />
              }
              <TouchableOpacity
                  onPress={() => { this.handleArrow(index); }}
              >
                <View style={style.version} >
                  {
                    item.info &&
                    <View style={style.iconInfo}>
                      <Text style={style.iconText}>1</Text>
                    </View>
                  }
                  {
                    item.icon === 'arrow' &&
                    <NbIcon style={style.iconRight} active type="Entypo" name="chevron-small-right" />
                  }
                </View>
              </TouchableOpacity>
            </View>
          );
        })
        }
        <Dialog
            modalVisible={this.state.versionVisible}
            handleSure={this.closeVersion}
            handleCancel={this.closeVersion}
            cancel={false}
        >
          <View style={style.versionView}>
            <Text style={style.versionTitle}>版本号</Text>
            <Text style={style.versionContext}>{this.versionInfo.version}</Text>
            <Text style={style.versionTitle}>新增功能</Text>
            <Text style={style.versionContext}>{this.versionInfo.function_descripe}</Text>
          </View>
        </Dialog>
        <Dialog
            modalVisible={this.state.upgradeVisible}
            handleSure={this.appUpgrade}
            handleCancel={this.closeUpgrade}
        >
          <View style={style.upgradeView}>
            <Text style={style.upgradeTitle}>是否确定升级新版本?</Text>
            <Text style={style.upgradeTitle2}>新增功能:</Text>
            <Text style={style.upgradeContext}>{this.newVersionInfo.functionDescripe}</Text>
          </View>
        </Dialog>
      </View >
    );
  }
}