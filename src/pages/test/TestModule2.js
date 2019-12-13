import React, { Component } from 'react';
import { View } from 'react-native';
import request from '../../utils/request';
import { Button as NbButton, Icon as NbIcon, Text as NbText} from 'native-base';

export default class TestModule2 extends Component {
  render() {
    onGetAll = () => {
      let options = {
        url: '/users/queryAll',
        method: 'get'
      };
      request(options).then(function (res) {
        let result = res.data;
        if (result.code === 0) {
          alert(JSON.stringify(result.data));
        }
      });
    };
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <NbText>test Module2</NbText>
        {/* <Button
          onPress={onGetAll}
          title="查询全部老师"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        /> */}
        <NbButton iconLeft onPress={onGetAll}> 
          <NbIcon name='home' />
          <NbText>Home</NbText>
        </NbButton>
      </View>
    );
  }
}