/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import AppContainer from './navigation/index';
import {
  Root as NbRoot
} from 'native-base';
export default class App extends React.Component {
  render() {
    return (
    <NbRoot>
      <AppContainer />
    </NbRoot>
    );
  }
}