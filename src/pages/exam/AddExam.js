import React, { Component } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  ToastAndroid
} from 'react-native';
import {
  Item as NbItem,
  Label as NbLabel,
  Input as NbInput,
  Icon as NbIcon,
  Textarea as NbTextarea,
  Fab as NbFab
} from 'native-base';
import request from '../../utils/request';
import style from '../../assets/styles/pages/exam/addExam';
import ImageAudioTab from '../../components/exam/ImageAudioTab';
import TypeBtn from '../../components/exam/TypeBtn';
import ResultOption from '../../components/exam/ResultOption';
import Loading from '../../components/Loading';
const path = require('path');


export default class AddExam extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: '添加试卷',
      headerRight: (
        <TouchableOpacity onPress={navigation.getParam('navigatePress')}>
          <Text style={style.sureAdd}>确认添加</Text>
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      questionList: [
        {
          questionId: 1,
          type: 0,
          stem: '',
          stemImg: [],
          stemAudio: [],
          audioTime: [],
          audioFlag: [],
          options: [],
          result: [],
          key: '1'
        }
      ],
      typelist: [0],
      indicator: false,
      nameIcon: ''
    };
    this.examName = '';
    this.numIndex = 2;
    this.timerID;
  }

  componentDidMount() {
    this.props.navigation.setParams({ navigatePress: this.saveExam.bind(this) });
  }
  componentWillUnmount() {
    this.timerID && clearTimeout(this.timerID);
  }

  changeExamName(examName) {
    this.examName = examName;
    let nameIcon = this.examName.length !== 0 ? 'checkmark-circle' : 'close-circle';
    this.setState({
      nameIcon: nameIcon
    }
    );
  }
  typePress = (qsIndex, type) => {
    let typelist = this.state.typelist;
    typelist[qsIndex] = type;
    let questionList = this.state.questionList;
    let question = questionList[qsIndex];
    question.result.splice(0);
    question.type = type;
    this.setState({
      typelist: typelist,
      questionList: questionList
    });
  }
  checkPress = (qsIndex, index) => {
    console.log(qsIndex, index);
    let questionList = this.state.questionList;
    let question = questionList[qsIndex];
    if (question.type === 0 || question.type === 2) {
      if (!question.result[index]) {
        question.result.splice(0);
      }
    }
    question.result[index] = !question.result[index];
    this.setState({
      questionList: questionList
    });
  }

  // 答案选项内容改变
  changeOptionContent = (qsIndex, index, content) => {
    let questionList = this.state.questionList;
    let question = questionList[qsIndex];
    question.options[index] = content;
    this.setState({
      questionList: questionList
    });
  }

  // 题目内容改变 
  changeQuestionContent(qsIndex, content) {
    let questionList = this.state.questionList;
    let question = questionList[qsIndex];
    question.stem = content;
    this.setState({
      questionList: questionList
    });
  }

  addQuestion() {
    let questionList = this.state.questionList;
    let item = {
      questionId: questionList.length + 1,
      type: 0,
      stem: '',
      stemImg: [],
      stemAudio: [],
      audioTime: [],
      audioFlag: [],
      options: [],
      result: [],
      key: '' + this.numIndex++
    };
    this.state.typelist.push(0);
    questionList.push(item);
    this.setState({
      questionList: questionList
    });
    let vm = this;
    this.timerID = setTimeout(function () {
      vm._flatList.scrollToEnd();
    });
  }

  deleteQuestion(qsIndex) {
    this.state.typelist.splice(qsIndex, 1);
    let questionList = this.state.questionList;
    questionList.splice(qsIndex, 1);
    this.setState({
      questionList: questionList
    });
  }

  // 相册/摄像头共同处理
  handleImage = (qsIndex, image) => {
    let questionList = this.state.questionList;
    let stemImg = questionList[qsIndex].stemImg;
    if (Array.isArray(image)) {
      /* eslint-disable no-unused-vars*/
      for (let item of image) {
        stemImg.push(item.path);
      }
      /* eslint-enable no-unused-vars*/
    } else {
      stemImg.push(image.path);
    }
    stemImg.splice(5);
    this.setState({
      questionList: questionList
    });
  }

  // 录音处理
  handleAudio = (qsIndex, audioFileURL, recordTime) => {
    let questionList = this.state.questionList;
    let { stemAudio, audioTime, audioFlag } = questionList[qsIndex];
    stemAudio.push(audioFileURL);
    audioTime.push(recordTime);
    audioFlag.push(1);
    this.setState({
      questionList: questionList
    });
  }

  // 改变录音的状态
  changeAudioState = (qsIndex, index, status) => {
    let questionList = this.state.questionList;
    let { audioFlag } = questionList[qsIndex];
    audioFlag[index] = status;
    this.setState({
      questionList: questionList
    });
  }

  // 确认添加
  saveExam() {
    let message = '';
    if (!this.examName) {
      message = '试卷名称为空！';
      this.setState({
        nameIcon: 'close-circle'
      });
    }
    if (this.state.questionList.length === 0) {
      message = '没有试题！';
    }
    if (message) {
      ToastAndroid.show(message, ToastAndroid.SHORT);
      return;
    }
    let flag = this.state.questionList.every((item, index) => {
      index++;
      if (!item.stem) {
        message = '第' + index + '道题目为空!';
      }
      let resultOptions = item.options.join('');

      let result = item.result.filter((item) => {
        return !!item;
      });

      if (resultOptions.length === 0) {
        message = '第' + index + '道答案选项为空!';
      }
      if (result.length === 0 && item.type !== 3) {
        message = '第' + index + '道答案为空!';
      }
      if (message) {
        ToastAndroid.show(message, ToastAndroid.SHORT);
        this._flatList.scrollToIndex({ viewPosition: index - 1, index: index - 1 });
        return false;
      }
      return true;
    });

    if (flag) {
      this.setState({
        indicator: true
      });
      let data = new FormData();
      for (let qsIndex = 0; qsIndex < this.state.questionList.length; qsIndex++) {
        let question = this.state.questionList[qsIndex];
        /* eslint-disable no-unused-vars*/
        for (let imgPath of question.stemImg) {
          let file = { uri: imgPath, type: 'multipart/form-data',name:escape(path.basename(imgPath))};
          data.append(qsIndex, file);
        }
        for (let audioPath of question.stemAudio) {
          let file = { uri: audioPath, type: 'multipart/form-data', name: escape(path.basename(audioPath)) };
          data.append(qsIndex, file);
        }
        /* eslint-enable no-unused-vars*/
      }
      data.append('examName', this.examName);
      data.append('questionList', JSON.stringify(this.state.questionList));
      let options = {
        headers:{
          'Accept':'multipart/form-data',
          'Content-Type':'multipart/form-data'
        },
        url: '/exam/addexam',  // 请求 url
        data: data,
        tipFlag: true, // 默认统一提示，如果需要自定义提示，传入 true
      };
      let vm = this;
      request(options).then(function (res) {
        if (res.status == 200) {
          ToastAndroid.show('成功创建试卷', ToastAndroid.SHORT);
          vm.props.navigation.goBack();
        }
      }).finally(function () {
        vm.setState({
          indicator: true
        });
      });
    }
  }

  render() {
    let questionList = this.state.questionList;
    let nameIcon = this.state.nameIcon;
    return (
      <View style={style.main} >
        <NbItem fixedLabel style={style.name}>
          <NbLabel
              style={style.nameLabel}
              onPress={() => this.saveExam()}>试卷名称：</NbLabel>
          <NbInput style={style.nameInput}
              onChangeText={(examName) => this.changeExamName(examName)} />
          {
            nameIcon.length != 0 &&
            <NbIcon name={nameIcon} style={nameIcon === 'checkmark-circle' ? style.iconSuccess : style.iconError} />
          }
        </NbItem>
        <FlatList
            ref={(flatList) => this._flatList = flatList}
            handleMethod={({ viewableItems }) => this.handleViewableItemsChanged(viewableItems)}
            data={this.state.questionList}
            renderItem={({ index }) => (
            <View style={style.flatListView}>
              <View style={style.title}>
                <Text style={style.titleNum}>{index + 1}、第 {index + 1} 题</Text>
                <TouchableOpacity
                    style={style.deleteTouch}
                    onPress={() => this.deleteQuestion(index)}>
                  <NbIcon type="AntDesign" name='closecircleo' style={style.deleteIcon}></NbIcon>
                </TouchableOpacity>
              </View>
              <View style={style.body}>
                <Text style={style.textContent}>题干：</Text>
                <NbTextarea
                    rowSpan={5}
                    bordered
                    placeholder="输入题目..."
                    onChangeText={(content) => this.changeQuestionContent(index, content)} />
                <ImageAudioTab
                    qsIndex={index}
                    stemImg={questionList[index].stemImg}
                    stemAudio={questionList[index].stemAudio}
                    audioFlag={questionList[index].audioFlag}
                    audioTime={questionList[index].audioTime}
                    handleImage={this.handleImage}
                    handleAudio={this.handleAudio}
                    changeAudioState={this.changeAudioState} />
                <Text style={style.textContent}>类型：</Text>
                <TypeBtn
                    qsIndex={index}
                    typePress={this.typePress} />
                <Text style={style.textAnswer}>答案：</Text>
                <ResultOption
                    type={this.state.typelist[index]}
                    qsIndex={index}
                    checked={questionList[index].result}
                    changeOptionContent={this.changeOptionContent}
                    checkPress={this.checkPress} />
                {/* {this.getResultOption(index, this.state.typelist[index])} */}
              </View>
            </View>
          )}
        />
        {this.state.indicator === true
         && <Loading loadingContent="正在保存试卷..."/>}
        <NbFab
            active={this.state.active}
            direction="up"
            containerStyle={{}}
            style={style.fab}
            position="bottomRight"
            onPress={() => this.addQuestion()}>
          <NbIcon type="AntDesign" name="plus" style={style.fabIcon} />
        </NbFab>
      </View>
    );
  }
}