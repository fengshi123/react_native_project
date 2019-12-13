import { StyleSheet } from 'react-native';
import screen from '../../../utils/screen';
export default StyleSheet.create({
  mainView:{
    flexDirection: 'row', 
    alignItems:'center',
    marginLeft:5
  },
  text:{
    fontSize:16,
    color:'#666',
    height:30,
    textAlignVertical:'center',
    marginRight:5
  },
  textInput:{
    width: screen.width-100, 
    borderColor: '#999', 
    borderBottomWidth: 1 
  }
});