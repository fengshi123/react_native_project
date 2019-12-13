
import React, { Component } from 'react';
import { 
    View, 
    Text 
} from 'react-native';
import {
    Button as NbButton,
    Icon as NbIcon
} from 'native-base';
import style from '../../assets/styles/components/typeBtn';

export default class TypeBtn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: 0
        };
    }
    typePress(qsIndex, index) {
        this.setState({selectIndex:index});
        this.props.typePress(qsIndex, index);
    }
    render() {
        let typeList = [
            '单选', '多选', '判断', '填空'
        ];
        let qsIndex = this.props.qsIndex;
        return (
            <View style={style.typeView}>
                {
                    typeList.map((item, index) => {
                        return (
                            <NbButton
                                key={index}
                                style={this.state.selectIndex === index ? style.typeBtnActive : style.typeBtn}
                                onPress={() => this.typePress(qsIndex, index)}>
                                <NbIcon
                                    type='AntDesign'
                                    name='plus'
                                    style={this.state.selectIndex === index ? style.typeIconActive : style.typeIcon} />
                                <Text style={this.state.selectIndex === index ? style.typeTextActive : style.typeText}>{item}</Text>
                            </NbButton>
                        );
                    }
                    )
                }
            </View>

        );
    }
}