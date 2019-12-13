import { StyleSheet } from 'react-native';

const typeBtn ={
    width:70,
    height:38,
    marginRight:5,
    justifyContent:'center',
    borderWidth:1,
    borderColor:'#3eb4ff',
};
const typeIcon ={
    fontSize: 16, 
    marginLeft:-4
};
const typeText ={
    marginLeft:-10,
};

export default StyleSheet.create({
    typeView: {
        flexDirection: 'row'
    },
    typeBtn:{
        ...typeBtn,
        backgroundColor:'#fff',
    },
    typeBtnActive:{
        ...typeBtn,
        backgroundColor:'#3eb4ff'
    },
    typeIcon:{
        ...typeIcon,
        color: '#3eb4ff',
    },
    typeIconActive:{
        ...typeIcon,
        color: '#fff',
    },
    typeText:{
       ...typeText,
       color: '#3eb4ff',
    },
    typeTextActive:{
        ...typeText,
        color:'#fff',
     }
});