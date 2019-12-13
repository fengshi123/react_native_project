
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { Button } from 'react-native';

export default class TestModule1 extends Component {
  render() {
    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>test Module1</Text>
          <Button
          onPress={() => this.props.navigation.navigate('TestModule2')}
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
        </View>
    );
  }
}