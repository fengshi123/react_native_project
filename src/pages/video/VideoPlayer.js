
import React, {Component} from 'react';
import {View, Dimensions, Image, Text, ToastAndroid,Slider, TouchableWithoutFeedback, TouchableOpacity,
     FlatList, StyleSheet, Keyboard, KeyboardAvoidingView, ActivityIndicator, CameraRoll} from 'react-native';
import {Item as NBItem, Input as NBInput,Button as NBButton, Icon as NBIcon, Badge as NBBadge} from 'native-base';
// import KeyboardSpacer from 'react-native-keyboard-spacer';
// import { Toast } from 'native-base';
import dayjs from 'dayjs';
import Video from 'react-native-video';
import NetInfo from '@react-native-community/netinfo';
import Orientation from 'react-native-orientation';
import VideoShare from '../../components/video/VideoShare';
import VideoMoreSetting from '../../components/video/VideoMoreSetting';
import CONSTANT from '../../utils/constant';
import request from '../../utils/request';
import globalVar from '../../utils/globalVar.js';

const screenWidth = Dimensions.get('window').width;

function formatTime(second) {
  let h = 0, i = 0, s = parseInt(second);
  if (s > 60) {
    i = parseInt(s / 60);
    s = parseInt(s % 60);
  }
  // 补零
  let zero = function (v) {
    return (v >> 0) < 10 ? '0' + v : v;
  };
  return [zero(h), zero(i), zero(s)].join(':');
}

export default class VideoPlayScreen extends Component {
  
  static navigationOptions = {
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      videoUrl: this.props.navigation.state.params.url,
    //   videoCover: '',
      videoWidth: screenWidth,
      videoHeight: screenWidth * 9/16, // 默认16：9的宽高比
      videoTitle: this.props.navigation.state.params.title, // 视频标题
    //   showVideoCover: true,    // 是否显示视频封面
      showLoading: true,
      showVideoControl: false, // 是否显示视频控制组件
      isPlaying: false,        // 视频是否正在播放
      currentTime: 0,        // 视频当前播放的时间
      duration: 0,           // 视频的总时长
      isFullScreen: false,     // 当前是否全屏显示
      playFromBeginning: false, // 是否从头开始播放
      isMuted: false,  // 是否静音
      volume: 1.0,   // 音量大小
      playRate: 1.0, // 播放速率
      lastSingleTapTime: 0,   //上次单点击视频区域的时间
      isShareMenuShow: false,  // 是否显示分享界面
      isSettingViewShow: false, // 是否显示设置界面
      commentText: '', // 评论
      commentArray: [], // 评论列表
      downLoad: false,
    };
    this.showKeyboard = false;
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', () => this.keyboardWillShow());
    this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', () => this.keyboardWillHide());
}

componentDidMount() {
    this.getComments();
  }

componentWillUnmount() {
    Orientation.lockToPortrait();
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
}

keyboardWillHide() {
   this.showKeyboard = false;
}

keyboardWillShow() {
   this.showKeyboard = true;
}
  
  render() {
    return (
      <View style={styles.container} onLayout={this._onLayout}>
        <View style={{ position:'absolute', left: 0, top: 0, width: this.state.videoWidth, height: this.state.videoHeight, backgroundColor:'#000000' }}>
          <Video
              ref={(ref) => this.videoPlayer = ref}
              source={{uri: CONSTANT.SERVER_URL + '/' + this.state.videoUrl}}
              rate={this.state.playRate}
              volume={this.state.volume}
              muted={this.state.isMuted}
              paused={!this.state.isPlaying}
              resizeMode={'contain'}
              playWhenInactive={false}
              playInBackground={false}
              ignoreSilentSwitch={'ignore'}
              progressUpdateInterval={250.0}
              onLoadStart={this._onLoadStart}
              onLoad={this._onLoaded}
              onProgress={this._onProgressChanged}
              onEnd={this._onPlayEnd}
              onError={this._onPlayError}
              onBuffer={this._onBuffering}
              style={{ width: this.state.videoWidth, height: this.state.videoHeight}}
          />
          {
            this.state.showLoading ?
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: this.state.videoWidth,
                height: this.state.videoHeight,
                backgroundColor: 'transparent',
                alignItems:'center',
                justifyContent:'center'
              }}>
                <ActivityIndicator size='large'/>
                <Text style={{
                  fontSize: 16,
                  color: '#666',
                }}>加载中</Text>
              </View> : null
          }
          <TouchableWithoutFeedback onPress={() => { this.hideControl(); }}>
            <View
                style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: this.state.videoWidth,
                height: this.state.videoHeight,
                backgroundColor: this.state.isPlaying ? 'transparent' : 'rgba(0, 0, 0, 0.2)',
                alignItems:'center',
                justifyContent:'center'
              }}>
              {
                this.state.isPlaying ? null :
                  <TouchableWithoutFeedback onPress={() => { this.onPressPlayButton(); }}>
                    <Image
                        style={styles.playButton}
                        source={require('../../assets/images/video/icon_video_play.png')}
                    />
                  </TouchableWithoutFeedback>
              }
            </View>
          </TouchableWithoutFeedback>
          {
            this.state.showVideoControl ?
              <View style={[styles.control, {width: this.state.videoWidth}]}>
              {/* <Image
                  source={require('../../assets/images/video/img_bottom_shadow.png')}
                  style={{position:'absolute', top: 0, left: 0, width: this.state.videoWidth, height:50}}
              /> */}
                <TouchableOpacity activeOpacity={0.3} onPress={() => { this.onPressPlayButton(); }}>
                  <Image
                      style={styles.playControl}
                      source={this.state.isPlaying ? require('../../assets/images/video/icon_control_pause.png') : require('../../assets/images/video/icon_control_play.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.time}>{formatTime(this.state.currentTime)}</Text>
                <Slider
                    style={{flex: 1}}
                    maximumTrackTintColor={'#999999'}
                    minimumTrackTintColor={'#00c06d'}
                    thumbImage={require('../../assets/images/video/icon_control_slider.png')}
                    value={this.state.currentTime}
                    minimumValue={0}
                    maximumValue={this.state.duration}
                    onValueChange={(currentTime) => { this.onSliderValueChanged(currentTime); }}
                />
                <Text style={styles.time}>{formatTime(this.state.duration)}</Text>
                <TouchableOpacity activeOpacity={0.3} onPress={() => { this.onControlShrinkPress(); }}>
                  <Image
                      style={styles.shrinkControl}
                      source={this.state.isFullScreen ? require('../../assets/images/video/icon_control_shrink_screen.png') : require('../../assets/images/video/icon_control_full_screen.png')}
                  />
                </TouchableOpacity>
              </View> : null
          }
          {
            <View
                style={{
                position:'absolute',
                top: 0,
                left: 0,
                width: this.state.videoWidth,
                height: 50,
                flexDirection:'row',
                alignItems:'space-around'
              }}>
              {/* <Image
                  source={require('../../assets/images/video/img_top_shadow.png')}
                  style={{position:'absolute', top: 0, left: 0, width: this.state.videoWidth, height:50}}
              /> */}
              <TouchableOpacity style={styles.backButton} onPress={this._onTapBackButton}>
                {/* <Image
                    source={require('../../assets/images/video/icon_back.png')}
                    style={{width: 26, height: 26}}
                /> */}
                <NBIcon active type="AntDesign" name="left"
                    style={{fontSize: 20,color:'#fff', marginRight: 10,}}/>
              </TouchableOpacity>
              <Text style={{fontSize: 16, color:'white'}} numberOfLines={1}>{this.state.videoTitle}</Text>
              {
                this.state.isFullScreen && this.state.showVideoControl ?
                  <View style={styles.topOptionView}>
                    <TouchableOpacity style={styles.topOptionItem} onPress={this._onTapShareButton}>
                      <Image
                          source={require('../../assets/images/video/icon_video_share.png')}
                          style={{width: 22, height: 22}}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.topOptionItem} onPress={this._onTapMoreButton}>
                      <Image
                          source={require('../../assets/images/video/icon_video_more.png')}
                          style={styles.topImageOption}
                      />
                    </TouchableOpacity>
                  </View> : null
              }
            </View>
        }
        {
          this.state.isFullScreen && this.state.isShareMenuShow ?
            <VideoShare
                style={{
                position:'absolute',
                top: 0,
                left: 0,
                width: this.state.videoWidth,
                height: this.state.videoHeight,
              }}
                videoUrl={this.props.navigation.state.params.url}
                videoTitle={this.props.navigation.state.params.title}
                onShareItemSelected={(index) => {this.onShareMenuPressed(index);}}
                onCloseWindow={() => { this.setState({isShareMenuShow: false}); }}
            /> : null
        }
        {
          this.state.isFullScreen && this.state.isSettingViewShow ?
            <VideoMoreSetting
                style={{
                position:'absolute',
                top: 0,
                left: 0,
                width: this.state.videoWidth,
                height: this.state.videoHeight,
              }}
                isMuted={this.state.isMuted}
                volume={this.state.volume}
                selectedRate={this.state.playRate}
                selectedEndTimeIndex={0}
                onFavoriteTapped={() => { this.setState({isSettingViewShow: false}); }}
                onDownloadTapped={() => { this.setState({isSettingViewShow: false}); }}
                onMuteVolumeTapped={(isMute) => { this.onMuteVolume(isMute); }}
                onPlayRateChanged={(rate) => { this.onPlayRateChange(rate); }}
                onEndTimeSelected={(index) => { this.onEndTimeChange(index); }}
                onCloseWindow={() => { this.setState({isSettingViewShow: false}); }}
                onVolumeChange={(volume) => { this.onVolumeChanged(volume); }}
            /> : null
        }
        </View>
        <View style={{ top: this.state.videoHeight, height: screenHeight - this.state.videoHeight, width: this.state.videoWidth }}>
            <KeyboardAvoidingView behavior="padding"
                style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',height: 60,backgroundColor:'#f0f0f0'}}>
                <NBItem rounded style={{width: screenWidth -160 , height:40,backgroundColor:'#fff'}}>
                    <NBIcon active type="AntDesign" name="edit" style={{fontSize: 14}}/>
                    <NBInput style={{fontSize: 14,}} placeholder='写评论'
                        onChangeText={(commentText) => this.setState({commentText})}
                        value={this.state.commentText}/>
                </NBItem>
                <NBButton small rounded
                    style={{height:40, width:40,justifyContent:'center', backgroundColor:'#EEEEEE',marginRight:10}}
                    onPress={ () => this.doComments()}>
                    <Text>评论</Text>
                </NBButton>
                <View style={{width:40,height:30,marginRight:10}}>
                    <NBIcon active type="EvilIcons" name="comment" style={{fontSize: 40,color:'grey'}}/>
                    <NBBadge style={{ height: 12,position:'absolute',right:-4, }}>
                        <Text style={{fontSize:10, top: -2,color:'#f0f0f0'}}>{this.state.commentArray.length}</Text>
                    </NBBadge>
                </View>
                <View style={{width:30,height:30,marginRight:10,}}>
                    <NBIcon type="AntDesign" name="download" style={{fontSize: 28,color:'grey'}} disabled={this.state.downLoad}
                        onPress={()=> this.saveVideo(CONSTANT.SERVER_URL + '/' + this.state.videoUrl)}/>
                    {this.state.downLoad ? <Text style={{color:'#fff',fontSize:8,textAlign:'center',backgroundColor:'green'}}>下载中</Text> : null}
                </View>
            </KeyboardAvoidingView>
            <Text style={{margin: 10, fontSize: 16}}>精彩评论</Text>
            <View style={{marginBottom:80}}>
                { this.state.commentArray.length > 0 ?
                    <FlatList
                        data={this.state.commentArray}
                        renderItem={({item}) => (
                            <View style={{
                                width: screenWidth,
                                backgroundColor: 'white',
                                flexDirection: 'row',
                                padding:10
                            }}>
                                <NBIcon active type="FontAwesome" name="user-circle"
                                    style={{fontSize: 30,color:'#BBBBBB', marginRight: 10,marginTop:8}}/>
                                <View style={{
                                    flexDirection:'column',
                                    justifyContent:'space-between',
                                    width:screenWidth - 60}} >
                                    <Text style={{color:'#66CCFF',fontSize:18,marginBottom:6}}>{item.user}</Text>
                                    <Text style={{marginBottom:6}}>{item.value}</Text>
                                    <Text style={{fontSize:10}}>{dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                </View>
                            </View>
                        )}
                    /> : <View style={{flexDirection:'row',justifyContent:'center',alignItems:'center',height:100}}>
                        <NBIcon active type="Entypo" name="emoji-happy"
                            style={{fontSize: 20,color:'#CCCCCC', marginRight: 6}}/>
                        <Text style={{color:'#CCCCCC'}}>欢迎评论</Text>
                    </View>
                }
            </View>
        </View>
      </View>
    );
  }

  /// -------Video组件回调事件-------
  
  _onLoadStart = () => {
    console.log('视频开始加载');
    NetInfo.fetch().then(state => {
        if (state.type === 'wifi') {
            ToastAndroid.show('当前网络为 wifi 模式',
                ToastAndroid.LONG,
                ToastAndroid.CENTER
            );
        } else {
            ToastAndroid.show('当前网络为 4G 模式',
                ToastAndroid.LONG,
                ToastAndroid.CENTER
            );
        }
    });
  };
  
  _onBuffering = () => {
    console.log('视频缓冲中...');
    this.setState({
        showLoading: true
      });
  };
  
  _onLoaded = (data) => {
    console.log('视频加载完成');
    this.setState({
      duration: data.duration,
    });
  };
  
  _onProgressChanged = (data) => {
    console.log('视频进度更新');
    if (this.state.isPlaying) {
      this.setState({
        currentTime: data.currentTime,
        showLoading: false
      });
    }
  };
  
  _onPlayEnd = () => {
    console.log('视频播放结束');
    this.setState({
      currentTime: 0,
      isPlaying: false,
      playFromBeginning: true
    });
  };
  
  _onPlayError = () => {
    console.log('视频播放失败');
  };
  
  ///-------控件点击事件-------
  
  /// 控制播放器工具栏的显示和隐藏
  hideControl() {
    if (this.state.showVideoControl) {
      this.setState({
        showVideoControl: false,
      });
    } else {
      this.setState(
        {
          showVideoControl: true,
        },
        // 5秒后自动隐藏工具栏
        () => {
          setTimeout(
            () => {
              this.setState({
                showVideoControl: false
              });
            }, 5000
          );
        }
      );
    }
  }
  
  /// 点击了播放器正中间的播放按钮
  onPressPlayButton() {
    let isPlay = !this.state.isPlaying;
    let isShowControl = false;
    if (isPlay) {
        isShowControl = true;
    }
    this.setState({
      isPlaying: isPlay,
      showVideoControl: isShowControl,
    //   showVideoCover: false
    });
    if (this.state.playFromBeginning) {
      this.videoPlayer.seek(0);
      this.setState({
        playFromBeginning: false,
      });
    }
  }
  
  /// 点击了工具栏上的播放按钮
  onControlPlayPress() {
    this.onPressPlayButton();
  }
  
  /// 点击了工具栏上的全屏按钮
  onControlShrinkPress() {
    if (this.state.isFullScreen) {
      Orientation.lockToPortrait();
    } else {
        Orientation.lockToLandscapeRight();
    }
  }

  // 点击分享
  _onTapShareButton = () => {
    this.setState({
      isShareMenuShow: true,
      showVideoControl: false
    });
  };
  
  // 点击更多
  _onTapMoreButton = () => {
    this.setState({
      isSettingViewShow: true,
      showVideoControl: false
    });
  };

//   onShareMenuPressed(index) {
//     this.setState({
//       isShareMenuShow: false
//     });
//   }

  async onMuteVolume(isMute) {
    // let volume = this.state.volume;
    let volume = 0;
    if (!isMute) {
      volume = 1.0;
    }
    await this.setState({
      isMuted: isMute,
      volume: volume,
      isSettingViewShow: false
    });
  }
  
  onPlayRateChange(rate) {
    this.setState({
      playRate: rate,
      isSettingViewShow: false
    });
  }
  
//   onEndTimeChange(index) {

//   }
  
  async onVolumeChanged(volume) {
    let isMute = (volume === 0);
    await this.setState({
      volume: volume,
      isMuted: isMute
    });
  }

  // 点击返回键
  _onTapBackButton = () => {
    if (this.state.isFullScreen) {
      Orientation.lockToPortrait();
    } else {
        this.props.navigation.goBack();
    }
  };

  // 评论
  async doComments() {
      if (this.state.commentText.trim() !== '') {
        const reqObj = {
            url: '/video/addComment',
            method: 'POST',
            data: {
              id: this.props.navigation.state.params.id,
              comment: this.state.commentText,
              name: globalVar.name,
              time: dayjs().valueOf()
            }
          };
          request(reqObj).then(async (response) => {
            const res = response.data;
            if (res.code === 0) {
                await this.setState({
                    commentText: ''
                });
                this.getComments();
            }
          });
      }
  }
 // 下载视频
  saveVideo(url) {
    this.setState({ downLoad: true });
    let promise = CameraRoll.saveToCameraRoll(url);
    promise.then(() => {
        this.setState({ downLoad: false });
        ToastAndroid.show('已下载到相册', ToastAndroid.SHORT);
     }).catch((error) => {
        this.setState({ downLoad: false });
        console.log(error);
        ToastAndroid.show('下载失败', ToastAndroid.SHORT);
     });
  }

    // 获取评论
    async getComments() {
        const reqObj = {
            url: '/video/queryComment',
            method: 'POST',
            data: {
            id: this.props.navigation.state.params.id
            }
        };
        request(reqObj).then(async (response) => {
            const res = response.data;
            if (res.code === 0) {
            const commentArr = res.data;
            this.setState({
                commentArray: []
            });
            for (let i = 0; i < commentArr.length; i ++) {
                await this.setState({
                    commentArray: [...this.state.commentArray, Object.assign({}, {
                        value: commentArr[i].comment_content,
                        key: commentArr[i].comment_id.toString(),
                        id: commentArr[i].comment_id,
                        user: commentArr[i].name,
                        time: commentArr[i].comment_time
                    })]
                });
            }
            this.setState({
                commentArray: this.state.commentArray.sort((a,b) => b.time - a.time)
            });
            }
        });
    }
  
  /// 进度条值改变
  onSliderValueChanged(currentTime) {
    this.videoPlayer.seek(currentTime);
    if (this.state.isPlaying) {
      this.setState({
        currentTime: currentTime
      });
    } else {
      this.setState({
        currentTime: currentTime,
        isPlaying: true,
        // showVideoCover: false
      });
    }
  }
  
  /// 屏幕旋转时宽高会发生变化，可以在onLayout的方法中做处理，比监听屏幕旋转更加及时获取宽高变化
  _onLayout = (event) => {
    //获取根View的宽高
    let {width, height} = event.nativeEvent.layout;
    console.log('通过onLayout得到的宽度：' + width);
    console.log('通过onLayout得到的高度：' + height);
    
    // 一般设备横屏下都是宽大于高，这里可以用这个来判断横竖屏
    let isLandscape = (width > height);
    if (isLandscape && !this.showKeyboard){
      this.setState({
        videoWidth: width,
        videoHeight: height,
        isFullScreen: true,
      });
    } else {
      this.setState({
        videoWidth: width,
        videoHeight: width * 9/16,
        isFullScreen: false,
      });
    }
    Orientation.unlockAllOrientations();
  };

}

export const screenHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  playButton: {
    width: 50,
    height: 50,
  },
  playControl: {
    width: 24,
    height: 24,
    marginLeft: 15,
  },
  shrinkControl: {
    width: 15,
    height: 15,
    marginRight: 15,
  },
  time: {
    fontSize: 12,
    color: 'white',
    marginLeft: 10,
    marginRight: 10
  },
  topOptionView: {
    position:'absolute',
    flexDirection: 'row',
    alignItems:'center',
    height: 50,
    right: 30,
    marginRight: 0
  },
  topOptionItem: {
    width: 50,
    height: 50,
    alignItems:'center',
    justifyContent:'center'
  },
  control: {
    flexDirection: 'row',
    height: 44,
    alignItems:'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    bottom: 0,
    left: 0
  },
});
