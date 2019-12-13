import React, { Component } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ToastAndroid
} from 'react-native';
import {
    Icon as NbIcon,
    ActionSheet as NbActionSheet,
    Tabs as NbTabs,
    Tab as NbTab
} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import style from '../../assets/styles/components/imageAudioTab';
import imgSite from '../../assets/index';
import Sound from 'react-native-sound';
import { AudioRecorder, AudioUtils } from 'react-native-audio';
import Spinkit from 'react-native-spinkit';
import PictureView from '../common/PictureView';

export default class ImageAudioTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgModalVisible:false,
            imgIndex:0
        };
        this.images = [],
        this.isRecording = false, // 是否录音的标志位
        this.requestFlag = true;
        this.recordTime = 0, // 录音时长
        this.audioPath = AudioUtils.DocumentDirectoryPath; // 文件路径
    }

    photoOption(qsIndex, stemImg) {
        if (stemImg.length >= 5) {
            ToastAndroid.show('每道题最多 5 张图片哦', ToastAndroid.SHORT);
            return;
        }
        let BUTTONS = [
            { text: '选择单张图片', icon: 'paper', iconColor: '#2c8ef4' },
            { text: '选择单张图片/裁剪', icon: 'color-filter', iconColor: '#f42ced' },
            { text: '选择多张图片', icon: 'calculator', iconColor: '#ea943b' },
            { text: '拍照', icon: 'camera', iconColor: '#25de5b' },
        ];
        NbActionSheet.show(
            {
                options: BUTTONS,
                title: '图片上传操作',
                destructiveButtonIndex: 1
            },
            buttonIndex => {
                if (buttonIndex === 0 || buttonIndex === 1 || buttonIndex === 2) {
                    this.pickImage(qsIndex, buttonIndex);
                } else if (buttonIndex === 3) {
                    this.openCamera(qsIndex);
                }
            }
        );
    }

    // 相册选择图片上传
    pickImage(qsIndex, buttonIndex) {
        let paramObj;
        switch (buttonIndex) {
            case 0:
                paramObj = {
                    mediaType: 'photo',
                };
                break;
            case 1:
                paramObj = {
                    width: 300,
                    height: 400,
                    mediaType: 'photo',
                    cropping: true,
                    enableRotationGesture: true,
                };
                break;
            case 2:
                paramObj = {
                    multiple: true,
                };
                break;
        }
        ImagePicker.openPicker(paramObj).then(image => {
            this.props.handleImage(qsIndex, image);
        }).catch(err => {
            console.log(err);
        });
    }

    // 调用摄像头功能
    openCamera(qsIndex) {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            this.props.handleImage(qsIndex, image);
        }).catch(err => {
            console.log(err);
        });
    }
    // 图片预览
    preview(index){
        this.setState({
            imgIndex: index,
            imgModalVisible: true
        });
    }
    // 关闭图片modal
    closeImg() {
        this.setState({
            imgIndex: 0,
            imgModalVisible: false
        });
    }

    // 开始录音
    startSoundRecording(qsIndex, stemAudio) {
        if (stemAudio.length >= 5) {
            ToastAndroid.show('每道题最多 5 段语音哦', ToastAndroid.SHORT);
            return;
        }
        console.log('startSoundRecording....');
        this.requestFlag = true;
        // 请求授权
        AudioRecorder.requestAuthorization()
            .then(isAuthor => {
                if (isAuthor && this.requestFlag) {
                    this.prepareRecordingPath(this.audioPath + qsIndex + '_' + stemAudio.length + '.aac');
                    // 录音进展
                    AudioRecorder.onProgress = (data) => {
                        this.recordTime = Math.floor(data.currentTime);
                    };
                    // 完成录音
                    AudioRecorder.onFinished = (data) => {
                        // data 返回需要上传到后台的录音数据;
                        this.isRecording = false;
                        if (!this.recordTime) {
                            ToastAndroid.show('录音时间太短...', ToastAndroid.SHORT);
                            return;
                        }
                        this.props.handleAudio(qsIndex, data.audioFileURL, this.recordTime);
                        // 重置为 0 
                        this.recordTime = 0;
                    };
                    // 录音
                    AudioRecorder.startRecording();
                    this.isRecording = true;
                }
                if(!isAuthor){
                    ToastAndroid.show('您未授权录音权限, 无法进行语音录入',ToastAndroid.SHORT);
                }
            });
    }

    /**
   * AudioRecorder.prepareRecordingAtPath(path,option)
   * 录制路径
   * path 路径
   * option 参数
   */
    prepareRecordingPath = (path) => {
        const option = {
            SampleRate: 44100.0, //采样率
            Channels: 2, //通道
            AudioQuality: 'High', //音质
            AudioEncoding: 'aac', //音频编码
            OutputFormat: 'mpeg_4', //输出格式
            MeteringEnabled: false, //是否计量
            MeasurementMode: false, //测量模式
            AudioEncodingBitRate: 32000, //音频编码比特率
            IncludeBase64: true, //是否是base64格式
            AudioSource: 0, //音频源
        };
        AudioRecorder.prepareRecordingAtPath(path, option);
    }

    // 结束录音
    stopSoundRecording() {
        console.log('stopSoundRecording....');
        this.requestFlag = false;
        // 已经被节流操作拦截，没有在录音
        if (!this.isRecording) {
            return;
        }
        AudioRecorder.stopRecording();
    }

    // 播放录音
    playSound(qsIndex, index, stemAudio, audioFlag, path) {
        this.props.changeAudioState(qsIndex, index, 2);
        let whoosh = new Sound(path.slice(7), '', (err) => {
            if (err) {
                return console.log(err);
            }
            whoosh.play(success => {
                if (success) {
                    console.log('success - 播放成功');
                } else {
                    console.log('fail - 播放失败');
                }
                this.props.changeAudioState(qsIndex, index, 1);
            });
        });
    }

    render() {
        let { qsIndex, stemImg, stemAudio, audioFlag, audioTime } = this.props;
        this.images.splice(0,this.images.length);
        stemImg.map((path, index) => {
            this.images.push({
                url: path,
                name: index
            });
        });
        return (
            <View style={style.main} >
                <NbTabs style={style.tabs}
                    tabBarUnderlineStyle={style.tabsBar}>
                    <NbTab heading="图片"
                        tabStyle={style.tab}
                        activeTabStyle={style.activeTab}
                        textStyle={style.tabText}
                        activeTextStyle={style.activeTabText} >
                        <View style={style.stemImgView}>
                            {stemImg.map((path, index) => {
                                return (
                                    <TouchableOpacity 
                                        key={index}
                                        onPress={() => this.preview(index)}>
                                        <Image
                                            style={style.stemImg}
                                            source={{ uri: path }}
                                        />
                                    </TouchableOpacity>);
                            })}
                            <TouchableOpacity
                                onPress={() => this.photoOption(qsIndex, stemImg)}>
                                <NbIcon
                                    type="MaterialCommunityIcons"
                                    name='border-inside'
                                    style={style.stemImgAdd} />
                            </TouchableOpacity>
                        </View>
                    </NbTab>
                    <NbTab heading="语音"
                        tabStyle={style.tab}
                        activeTabStyle={style.activeTab}
                        textStyle={style.tabText}
                        activeTextStyle={style.activeTabText}>
                        <View style={style.stemAudioView}>
                            {stemAudio.map((path, index) => {
                                return (
                                    <TouchableOpacity
                                        style={style.audioTouch}
                                        key={path}
                                        onPressIn={() => this.playSound(qsIndex, index, stemAudio, audioFlag, path)}>
                                        {audioFlag[index] === 1 &&
                                            <View style={style.audioView}>
                                                <Image
                                                    style={style.audioImg}
                                                    source={imgSite.sound}
                                                />
                                                <Text style={style.audioText}>{audioTime[index]}{'\'\''}</Text>
                                            </View>
                                        }{audioFlag[index] === 2 &&
                                            <Spinkit
                                                isVisible={true}
                                                size={32}
                                                type={'Wave'}
                                                style={style.spinkit}
                                            />
                                        }
                                    </TouchableOpacity>);
                            })}
                            <TouchableOpacity
                                onPress={() => {} }
                                onLongPress={() => this.startSoundRecording(qsIndex, stemAudio)}
                                onPressOut={() => this.stopSoundRecording(qsIndex)}
                            >
                                <Image
                                    style={style.audio}
                                    source={imgSite.exam_audio}
                                />
                            </TouchableOpacity>
                        </View>
                    </NbTab>
                </NbTabs>
                <PictureView
                    style={{ flex: 1 }}
                    images={this.images}
                    imgIndex={this.state.imgIndex}
                    imgModalVisible={this.state.imgModalVisible}
                    closeImg={() => this.closeImg()}
                />
            </View>
        );
    }
}