
import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';

import imgSite from '../assets/index';
import style from '../assets/styles/homePage';
export default class HomePage extends Component {
  handlePress(path) {
    if (path === 'ExamList1' || path === 'ExamList2') {
      let mark = path === 'ExamList1' ? 1 : 0;
      this.props.navigation.navigate('ExamList', {
        mark: mark
      });
    } else if (path === 'learnPoint' || path === 'suggestedFeedback') {
      ToastAndroid.show('该功能还在路上...', ToastAndroid.SHORT);
    } else {
      this.props.navigation.navigate(path);
    }
  }
  render() {
    let itemList = [
      [
        {
          title: '添加试卷',
          image: imgSite.study,
          path: 'AddExam'
        },
        {
          title: '试题问答',
          image: imgSite.question,
          path: 'ExamList1'
        },
        {
          title: '成绩统计',
          image: imgSite.mydisk,
          path: 'ExamList2'
        },
      ],
      [
        {
          title: '视听空间',
          image: imgSite.grade,
          path: 'VideoList'
        },
        {
          title: '学习积分',
          image: imgSite.others,
          path: 'learnPoint'
        },
        {
          title: '建议反馈',
          image: imgSite.information,
          path: 'suggestedFeedback'
        }
      ]
    ];

    const listItems = itemList.map((itemArray, i) => {
      return (
        <View
            style={{ flexDirection: 'row', justifyContent: 'space-around' }}
            key={i}
        >
          {itemArray.map((item) => {
            return (
              <TouchableOpacity
                  key={item.title}
                  onPress={() => { this.handlePress(item.path); }}
              >
                <View key={item.title}>
                  <Image
                      style={style.opImg}
                      source={item.image}
                  />
                  <Text style={style.opText}>{item.title}</Text>
                </View>
              </TouchableOpacity>
            );
          })
          }
        </View>
      );
    }
    );

    return (
      <View style={{ flex: 1 }} >
        <Image
            style={style.bgImage}
            source={imgSite.headbg}
        />
        {listItems}
      </View>
    );
  }
}