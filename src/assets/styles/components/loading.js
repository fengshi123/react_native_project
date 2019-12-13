import { StyleSheet } from 'react-native';
import screen from '../../../utils/screen';
export default StyleSheet.create({
    LoadingPage:{
        position: 'absolute',
        width:screen.width,
        height:screen.height,
        zIndex:1000,
        alignItems: 'center',
    },
    indicator:{
        top:screen.height/2-150,
        color:'#3eb4ff'
    },
    indicatorText:{
        top:screen.height/2-135,
        color:'#3eb4ff',
        fontSize:16,
    }
});