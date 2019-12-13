
import React, { Component } from 'react';
import { Text, View,Button} from 'react-native';

export default class Tab1 extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
       <Button
           onPress={ this.props.navigation.navigate('TestModule2')}
           title="登录"
           color="#841584"
           accessibilityLabel="Learn more about this purple button"
        />
    </View>
    );
  }
}