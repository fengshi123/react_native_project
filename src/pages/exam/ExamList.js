
import React, { Component } from 'react';
import { 
  ScrollView, 
  View, 
  Image, 
  Text, 
  ToastAndroid 
} from 'react-native';
import {
  List as NbList,
  ListItem as NbListItem,
  Left as NbLeft,
  Body as NbBody,
  Right as NbRight,
  Text as NbText,
} from 'native-base';
import request from '../../utils/request';
import Loading from '../../components/Loading';
import imgSite from '../../assets/index';
import style from '../../assets/styles/pages/exam/examList';

export default class ExamList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eList: [],
      isLoading: true
    };
    this.questionList = [];
    this.mark = parseInt(this.props.navigation.state.params.mark);
  }

  componentDidMount() {
    this.subs = [
      this.props.navigation.addListener('didFocus', () => this.handleGetall()),
    ];
  }

  componentWillUnmount() {
    this.subs.forEach(sub => sub.remove());
  }

  handleGetall() {
    let options = {
      url: '/exam/queryExamId',
      method: 'get'
    };
    let vm = this;
    request(options).then(function (res) {
      let result = res.data;
      let exam = [];
      if (result.code === 0) {
        if (vm.mark === 1) {
          vm.setState({
            eList: result.data,
            isLoading: false
          });
        } else {
          for (var i = 0; i < result.data.length; i++) {
            if (result.data[i].is_finish === 1) {
              exam.push(result.data[i]);
            }
          }
          vm.setState({
            eList: exam,
            isLoading: false
          });
        }
      }
    });
  }

  comeInExam(examId, name) {
    if (this.mark === 1) {
      let options = {
        url: '/exam/queryQuestionById?exam_id=' + examId,
        method: 'get'
      };
      let vm = this;
      request(options).then(function (res) {
        let result = res.data;
        if (result.code === 0) {
          vm.questionList = result.data;
          if (vm.questionList.length === 0) {
            ToastAndroid.show('此试卷为空', ToastAndroid.SHORT);
          } else {
            let tab;
            if (vm.state.eList[vm.state.eList.length - examId].is_finish === 1) {
              // 试卷已完成，进入答案阅览模式
              tab = 1;
            } else {
              // 试卷未完成，进入答题模式
              tab = 0;
            }
            vm.props.navigation.navigate('AnswerQuestion', {
              tab: tab,
              questionList: vm.questionList,
              refresh: () => { vm.handleGetall(); }
            });
          }
        }
      });
    } else {
      this.props.navigation.navigate('ResultStatistics', {
        exam_id: examId,
        name: name
      });
    }
  }

  // loading 
  getLoading() {
    if (this.state.isLoading === true) {
      return (
        <Loading loadingContent="正在加载试卷列表..." />
      );
    }
  }

  examEmpty() {
    if (this.state.eList.length === 0 && this.state.isLoading === false) {
      return (
        <View style={style.emptyPage}>
          <Image
              style={style.emptyImg}
              source={imgSite.exam_icon}
          />
          <Text style={style.empty}>空空如也...</Text>
        </View>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <View>
        {this.getLoading()}
        <ScrollView>
          <NbList>
            {this.state.eList.map((item, index) => {
              return (
                <NbListItem
                    key={index}
                    onPress={() => this.comeInExam(item.exam_id, item.name)}
                >
                  <NbLeft>
                    {
                      item.is_finish === 1 ?
                        <Image
                            style={style.imgf}
                            source={imgSite.exam_icon}
                        />
                        :
                        <Image
                            style={style.img}
                            source={imgSite.exam_icon}
                        />
                    }
                  </NbLeft>
                  <NbBody >
                    <View>
                      {
                        item.is_finish === 1 ?
                          <Text style={style.namef}>{item.name}</Text>
                          :
                          <Text style={style.name}>{item.name}</Text>
                      }
                      {
                        item.is_finish === 1 ?
                          <Text style={style.is_finish}>已完成</Text>
                          :
                          null
                      }
                    </View>
                  </NbBody>
                  <NbRight />
                  {
                    item.is_finish === 1 ?
                      <NbText style={style.namef}>{item.create_time}</NbText>
                      :
                      <NbText style={style.name}>{item.create_time}</NbText>
                  }
                </NbListItem>
              );
            })}
          </NbList>
          {this.examEmpty()}
        </ScrollView>
      </View>
    );
  }
}