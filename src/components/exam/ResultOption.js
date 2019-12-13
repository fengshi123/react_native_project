
import React, { Component } from 'react';
import { 
    View, 
    Text, 
    TextInput
 } from 'react-native';
import {
    CheckBox as NbCheckBox
} from 'native-base';
import style from '../../assets/styles/components/resultOption';

export default class ResultOption extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        let { type, qsIndex, checked, changeOptionContent, checkPress } = this.props;
        if (type === 3) {
            return (
                <TextInput
                    style={style.textInput}
                    onChangeText={(content) => changeOptionContent(qsIndex, 0, content)} />
            );
        } else {
            let choiceList = ['A', 'B', 'C', 'D'];
            let judgeList = ['Y', 'N'];
            let itemList = type === 2 ? judgeList : choiceList;
            return itemList.map((item, index) => {
                return (
                    <View style={style.mainView} key={index}>
                        <Text style={style.text}>{item}:</Text>
                        <TextInput
                            style={style.textInput}
                            onChangeText={(content) => changeOptionContent(qsIndex, index, content)} />
                        <NbCheckBox
                            checked={checked[index]}
                            onPress={() => checkPress(qsIndex, index)}>
                        </NbCheckBox>
                    </View>
                );
            });
        }
    }
}