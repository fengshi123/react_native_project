
import React, { Component } from 'react';
import {
  ScrollView,
  View,
  Image,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  Text
} from 'react-native';
import {
  Text as NbText,
  ListItem as NbListItem,
  CheckBox as NbCheckBox,
  Right as NbRight,
  Left as NbLeft,
  Tab as NbTab,
  Tabs as NbTabs,
  Button as NbButton
} from 'native-base';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import request from '../../utils/request';
import style from '../../assets/styles/pages/exam/answerQuestion';
import AEstyle from '../../assets/styles/components/imageAudioTab';
import CONSTANT from '../../utils/constant';
import imgSite from '../../assets/index';
import Sound from 'react-native-sound';
import Spinkit from 'react-native-spinkit';
import PictureView from '../../components/common/PictureView';

export default class AnswerQuestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      optionlist: [
        { title: '', value: 'A', disabled: false, checked: false },
        { title: '', value: 'B', disabled: false, checked: false },
        { title: '', value: 'C', disabled: false, checked: false },
        { title: '', value: 'D', disabled: false, checked: false }
      ],
      judgeList: [
        { title: '', value: 'Y', disabled: false, checked: false },
        { title: '', value: 'N', disabled: false, checked: false }
      ],
      type: 0,
      stemList: [],
      clickText: '下一题',
      audioFlag: [],
      imgModalVisible: false,
      imgIndex: 0
    };
    this.typelist = ['单选题', '多选题', '判断题', '填空题'];
    this.questionId = 0;
    this.answerList = [];
    this.tkPlace = true;
    this.isRight = '';
    this.radioAnswer = [];
    this.boxAnswer = [];
    this.judgeAnswer = [];
    this.answer = '';
    this.tab = '';
    this.questionList = [];
    this.images = [];
  }

  componentDidMount() {
    let navigation = this.props.navigation;
    this.tab = navigation.state.params.tab;
    this.questionList = navigation.state.params.questionList;
    this.queryQuestion();
  }

  buttonClick() {
    // 答题时，储存答案，最后一次性提交
    if (this.tab === 0) {
      let stemItem = this.state.stemList[0];
      if (stemItem.type === 0) {
        this.answer = this.radioAnswer;
        this.radioAnswer = [];
      } else if (stemItem.type === 1) {
        this.getCheckedBox();
        this.answer = this.boxAnswer.join('|');
        this.boxAnswer = [];
      } else if (stemItem.type === 2) {
        this.answer = this.judgeAnswer;
        this.judgeAnswer = [];
      }
      // 如果未选答案，则提示，且不可进入下一题
      if (this.answer.length === 0 || this.answer === null) {
        // alert('此题答案为空，无法进入下一题！');
        ToastAndroid.show('此题答案为空，无法进入下一题！', ToastAndroid.SHORT);
      } else {
        // 将answer存入answerList中
        let item = {
          questionid: stemItem.question_id,
          examid: stemItem.exam_id,
          answerOption: this.answer
        };
        this.answerList.push(item);
        if (this.state.clickText === '提交') {
          // 提交答案
          this.addAnswer();
        }
        this.queryQuestion();
      }
      this.answer = '';
    } else {
      // 答案阅览模式
      if (this.state.clickText === '返回列表') {
        this.props.navigation.goBack();
      }
      this.queryQuestion();
    }
  }

  queryQuestion() {
    // 获取题目
    if (this.questionId < this.questionList.length) {
      let optionlist = [...this.state.optionlist];
      let judgeList = [...this.state.judgeList];
      let qlk = this.questionList[this.questionId];
      let type = parseInt(qlk.type);
      let stemItem = {
        type: type,
        question_id: qlk.question_id,
        sum: '/' + this.questionList.length,
        exam_id: qlk.exam_id,
        stem: qlk.stem,
        stem_img: qlk.stem_img.split('|'),
        stem_audio: qlk.stem_audio.split('|'),
        audio_time: qlk.audio_time.split('|'),
        result_options: qlk.result_options.split('|'),
        result: qlk.result.split('|').toString()
      };
      if (stemItem.stem_audio[0] !== '') {
        let audioFlag = this.state.audioFlag;
        for (var n = 0; n < stemItem.stem_audio.length; n++) {
          audioFlag.push(1);
        }
        this.setState({
          audioFlag: audioFlag
        });
      }
      this.setState({
        stemList: [stemItem],
        type: stemItem.type,
      });
      for (var i = 0; i < stemItem.result_options.length; i++) {
        if (type === 0 || type === 1) {
          optionlist[i].title = stemItem.result_options[i];
          optionlist[i].checked = false;
          if (this.tab === 1) {
            optionlist[i].disabled = true;
          }
        } else if (type === 2) {
          judgeList[i].title = stemItem.result_options[i];
          judgeList[i].checked = false;
          if (this.tab === 1) {
            judgeList[i].disabled = true;
          }
        }
      }
      // 阅览模式
      if (this.tab === 1) {
        let userAnswer = qlk.answer.split('|').toString();
        this.isRight = userAnswer === stemItem.result ? 1 : 0;
        let answerArr = qlk.answer.split('|');
        for (var j = 0; j < stemItem.result_options.length; j++) {
          if ((type === 0 || type === 1) && answerArr.indexOf(optionlist[j].value) > -1) {
            optionlist[j].checked = true;
          }
          if (type === 2 && userAnswer === judgeList[j].value) {
            judgeList[j].checked = true;
          }
        }
        if (type === 3) {
          this.tkPlace = false;
          this.answer = userAnswer;
        }
      }
      this.questionId++;
      if (this.questionId === this.questionList.length) {
        this.setState({
          clickText: this.tab === 1 ? '返回列表' : '提交'
        });
      }
    }
  }

  addAnswer() {
    let param = {
      answerList: this.answerList
    };
    let options = {
      url: '/exam/addAnswer',
      method: 'POST',
      data: param
    };
    request(options).then(function (res) {
      let message = res.data.code === 0 ? '提交答案成功' : '提交答案失败';
      ToastAndroid.show(message, ToastAndroid.SHORT);
    });
    this.props.navigation.state.params.refresh();
    this.props.navigation.goBack();
  }

  checkRadio(value, list) {
    let option = [];
    for (let i = 0; i < list.length; i++) {
      if (list[i].value === value) {
        list[i].checked = true;
        option = list[i].value;
      } else {
        list[i].checked = false;
      }
    }
    if (list === this.state.optionlist) {
      this.setState({
        optionlist: list
      });
      this.radioAnswer = option;
    } else if (list === this.state.judgeList) {
      this.setState({
        judgeList: list
      });
      this.judgeAnswer = option;
    }
  }

  checkBox(value, list) {
    for (let i = 0; i < list.length; i++) {
      if (list[i].value === value) {
        list[i].checked = !list[i].checked;
      }
    }
    this.setState({
      optionlist: list
    });
  }

  getCheckedBox() {
    for (let i = 0; i < this.state.optionlist.length; i++) {
      if (this.state.optionlist[i].checked === true) {
        this.boxAnswer.push(this.state.optionlist[i].value);
      }
    }
  }

  getType(e) {
    return this.typelist[e];
  }

  renderByType(item, list, type) {
    if (item.disabled === false) {
      if (type === 0 || type === 2) {
        this.checkRadio(item.value, list);
      } else if (type === 1) {
        this.checkBox(item.value, list);
      }
    }
  }

  // 图片预览
  preview(index) {
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

  // 录制的音频列表
  getAudioList(audio, aIndex, index) {
    let vm = this;
    return (
      <TouchableOpacity
          key={aIndex}
          onPressIn={() => vm.playSound(audio, aIndex)}
      >
        {
          vm.state.audioFlag[aIndex] === 1 &&
          <View style={style.audioView}>
            <Image
                style={style.audioImg}
                source={imgSite.sound}
            />
            <NbText style={style.audioText}>{vm.state.stemList[index].audio_time[aIndex]}{'\'\''}</NbText>
          </View>
        }{
          vm.state.audioFlag[aIndex] === 2 &&
          <Spinkit
              isVisible={true}
              size={32}
              type={'Wave'}
              style={style.spinkit}
          />
        }
      </TouchableOpacity>);
  }

  // 播放录音
  playSound(audio, aIndex) {
    let audioFlag = this.state.audioFlag;
    audioFlag[aIndex] = 2;
    this.setState({
      audioFlag: audioFlag
    });
    let whoosh = new Sound(CONSTANT.SERVER_URL + '/' + audio, '', (err) => {
      if (err) {
        return console.log(err);
      }
      whoosh.play(success => {
        if (success) {
          console.log('success - 播放成功');
        } else {
          console.log('fail - 播放失败');
        }
        audioFlag[aIndex] = 1;
        this.setState({
          audioFlag: audioFlag
        });
      });
    });
  }

  render() {
    this.images.splice(0,this.images.length);
    let content;
    let list;
    let type = this.state.type;
    if (type === 0 || type === 1 || type === 2) {
      if (type === 0 || type === 1) {
        list = this.state.optionlist;
      } else if (type === 2) {
        list = this.state.judgeList;
      }
      content = (
        list.map((item, index) => {
          return (
            <NbListItem
                key={index}
                onPress={() => this.renderByType(item, list, type)}
            >
              <NbLeft>
                <NbText>{item.value}、{item.title}</NbText>
              </NbLeft>
              <NbRight>
                <NbCheckBox checked={item.checked} onPress={() => this.renderByType(item, list, type)} />
              </NbRight>
            </NbListItem>
          );
        })
      );
    } else if (type === 3) {
      content = (
        <TextInput
            style={style.input}
            placeholder="请输入你的答案"
            editable={this.tkPlace}
            onChangeText={(text) => this.answer = text}
        >
          {this.answer}
        </TextInput>
      );
    }
    return (
      <View>
        <ScrollView style={style.main}>
          {this.state.stemList.map((item, index) => {
            return (
              <View key={index}>
                <View style={style.property}>
                  <View style={style.label} />
                  <NbText style={style.type}>{this.getType(item.type)}</NbText>
                  <NbText style={style.questionId}>{item.question_id}</NbText>
                  <NbText style={style.sum}>{item.sum}</NbText>
                </View>
                <View style={style.content}>
                  <NbText style={style.problem}>  {item.stem}</NbText>
                  {item.stem_img[0] !== '' || item.stem_audio[0] !== '' ?
                    <NbTabs
                        style={AEstyle.tabs}
                        tabBarUnderlineStyle={AEstyle.tabsBar}
                    >
                      <NbTab heading="图片"
                          tabStyle={AEstyle.tab}
                          activeTabStyle={AEstyle.activeTab}
                          textStyle={AEstyle.tabText}
                          activeTextStyle={AEstyle.activeTabText}
                      >
                        <View style={AEstyle.stemImgView}>
                          {item.stem_img.map((img, i) => {
                            this.images.push({
                              url: CONSTANT.SERVER_URL + '/' + img,
                              name: i
                            });
                            return (
                              img !== '' ?
                                <TouchableOpacity
                                    key={i}
                                    onPress={() => this.preview(i)} >
                                  <Image
                                      source={{ uri: CONSTANT.SERVER_URL + '/' + img }}
                                      style={style.img}
                                  />
                                </TouchableOpacity>
                                :
                                <TouchableOpacity key={i} >
                                  <Image
                                      source={imgSite.noPicture}
                                      style={style.img}
                                  />
                                </TouchableOpacity>
                            );
                          })}
                        </View>
                      </NbTab>
                      <NbTab
                          heading="音频"
                          tabStyle={AEstyle.tab}
                          activeTabStyle={AEstyle.activeTab}
                          textStyle={AEstyle.tabText}
                          activeTextStyle={AEstyle.activeTabText}
                      >
                        <View style={AEstyle.stemAudioView}>
                          {item.stem_audio.map((audio, aIndex) => {
                            return (
                              audio !== '' ?
                                //播放音频
                                this.getAudioList(audio, aIndex, index)
                                :
                                <TouchableOpacity key={aIndex} >
                                  <Image
                                      source={imgSite.noAudio}
                                      style={style.img}
                                  />
                                </TouchableOpacity>
                            );
                          })}
                        </View>
                      </NbTab>
                    </NbTabs>
                    : null
                  }
                  {this.tab === 1 ?
                    <View style={style.answer}>
                      <NbText style={style.result}>正确答案：{item.result}</NbText>
                      {this.isRight === 0 ?
                        <FontAwesome name={'times-circle'} size={30} style={style.wrongIcon} />
                        :
                        <FontAwesome name={'check-circle'} size={30} style={style.rightIcon} />
                      }
                    </View>
                    : null
                  }
                </View>
              </View>
            );
          })}
          <View style={style.contentView}>
            {content}
          </View>
          <View style={style.buttonView}>
            <NbButton
                style={style.button}
                onPress={() => this.buttonClick()}
            >
              <Text style={style.buttonText}>{this.state.clickText}</Text>
            </NbButton>
          </View>
        </ScrollView>
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