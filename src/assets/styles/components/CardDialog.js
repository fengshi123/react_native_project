import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
    height: '100%'
    
  },
  modalContent: {
    backgroundColor:'white',
    top: '50%',
    left: '50%',
    marginLeft: -125,
    marginTop: -50,
    width: 250,
    height: 100,
    borderRadius: 8,
  },
  modalText: {
    fontSize: 32,
    color: '#fff',
  },
  input: {
    width: 230,
    height: 50,
    marginLeft: 10,
  },
  footer: {
    height:50,
    width:250,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopColor: '#EEEEEE',
    borderTopWidth:1,
  },
  confirmDel: {
    height: 50,
    lineHeight: 50,
    fontSize: 18,
    paddingLeft:10,
    textAlign:'center',
  },
  itemBtn: {
    justifyContent: 'center',
    textAlign:'center',
    zIndex: 10
  },
  btnOk: {
      width:125,
    color: 'red',
    textAlign:'center',
    fontSize: 18
  },
  btnCancel: {
    width:125,
    textAlign:'center',
    color: 'green',
    fontSize: 18
  }
});