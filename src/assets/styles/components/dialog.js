import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%',
    justifyContent:'center',
    alignItems:'center'
    
  },
  modalContent: {
    backgroundColor:'#fff',
    justifyContent:'center',
    width: 280,
    borderRadius: 8,
  },
  footer: {
    width:280,
    flexDirection: 'row',
    justifyContent:'flex-end',
    alignItems:'center',
    height:60
  },
  btn: {
    width:60,
    color: '#3eb4ff',
    fontSize: 16,
  }
});