import ExamList from '../../pages/exam/ExamList';
import AddExam from '../../pages/exam/AddExam';
import ResultStatistics from '../../pages/exam/ResultStatistics';
import AnswerQuestion from '../../pages/exam/AnswerQuestion';
import React from 'react';
import { View } from 'react-native';
export default {
  ExamList: {
    screen: ExamList,
    navigationOptions: {
      title: '试卷列表',
      headerRight:<View/>
    },
   
  },
  AddExam: {
    screen: AddExam,
  },
  AnswerQuestion: {
    screen: AnswerQuestion,
    navigationOptions: {
      title: '答题',
      headerRight:<View/>
    }
  },
  ResultStatistics: {
    screen: ResultStatistics,
    navigationOptions: {
      title: '成绩统计'
    }
  }
};