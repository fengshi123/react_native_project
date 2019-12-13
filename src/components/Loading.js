import React, { Component } from 'react';
import { 
    Text, 
    View, 
    ActivityIndicator 
} from 'react-native';
import style from '../assets/styles/components/loading';
export default class loading extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <View style={style.LoadingPage}>
                <ActivityIndicator 
                    size="large" 
                    color="#3eb4ff" 
                    style={style.indicator}/>
                <Text style={style.indicatorText}>{this.props.loadingContent}</Text>
            </View>
        );
    }
}
