import React from 'react';
import {View, Image, Text, TouchableOpacity, StyleSheet, ToastAndroid,} from 'react-native';
import PropTypes from 'prop-types';
import * as WeChat from 'react-native-wechat';
import CONSTANT from '../../utils/constant';

// const wxAppId = ''; // 微信开放平台注册的app id
// const wxAppSecret = ''; // 微信开放平台注册得到的app secret
// WeChat.registerApp(wxAppId);

export default class VideoShare extends React.Component {
  
  static propTypes = {
    onShareItemSelected: PropTypes.func,
    onCloseWindow: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
        videoUrl: this.props.videoUrl,
        videoTitle: this.props.videoTitle,
    };
  }

  componentDidMount (){
    WeChat.registerApp('wxbfb30e9fa2da4f0d');
  }
  
  render() {
    return (
      <TouchableOpacity
          activeOpacity={1}
          style={[styles.container, this.props.style]}
          onPress={this._onTapBackground}
      >
        <Text style={styles.shareTitle}>分享至</Text>
        <View style={styles.shareMenuView}>
          {
            shareOptions.map((item, index) => {
              return (
                <TouchableOpacity
                    key={index}
                    style={styles.shareItem}
                    activeOpacity={0.8}
                    onPress={() => {this.shareItemSelectedAtIndex(index);}}
                >
                  <Image
                      source={item.imageRef}
                      style={styles.image}
                  />
                  <Text style={styles.title}>{item.title}</Text>
                </TouchableOpacity>
              );
            })
          }
        </View>
      </TouchableOpacity>
    );
  }
  
  _onTapBackground = () => {
    this.props.onCloseWindow && this.props.onCloseWindow();
  };
  
  shareItemSelectedAtIndex(index) {
    // this.props.onShareItemSelected && this.props.onShareItemSelected(index);
    WeChat.isWXAppInstalled().then((isInstalled) => {
        this.setState({
          isWXInstalled: isInstalled
        });
        if (isInstalled && index === 0) {
          WeChat.shareToSession({
            title: this.state.videoTitle,
            type: 'video',
            videoUrl: CONSTANT.SERVER_URL + '/' + this.state.videoUrl
        }).catch((error) => {
                ToastAndroid.show(
                    error.message,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                    );
            });
        } else if (isInstalled && index === 1) {
            WeChat.shareToTimeline({
                title: this.state.videoTitle,
                type: 'video',
                videoUrl: CONSTANT.SERVER_URL + '/' + this.state.videoUrl
            }).catch((error) => {
                  ToastAndroid.show(
                    error.message,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                    );
              });
          } else {
            ToastAndroid.show(
                '微信未安装',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
                );
        }
      });
  }
}

const shareOptions = [
//   {imageRef:require('../../assets/images/video/icon_share_qq.png'), title:'QQ'},
  {imageRef:require('../../assets/images/video/icon_share_wxsession.png'), title:'微信'},
  {imageRef:require('../../assets/images/video/icon_share_wxtimeline.png'), title:'朋友圈'},
];

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems:'center',
    justifyContent:'center'
  },
  shareMenuView: {
    flexDirection:'row',
    flexWrap:'wrap',
    alignItems:'center',
    marginTop: 10,
    width: 200,
  },
  shareTitle: {
    fontSize: 16,
    color: 'white',
  },
  shareItem: {
    alignItems:'center',
    justifyContent:'center',
    margin: 20
  },
  image: {
    width:60,
    height:60
  },
  title: {
    marginTop: 5,
    fontSize:13,
    color: 'white'
  }
});