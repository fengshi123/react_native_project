import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  },
  rightContainer: {
    flex: 1
  },
  title: {
    fontSize: 20,
    marginLeft: 10,
    lineHeight: 40
  },
  year: {
  },
  rowFront: {
    padding:1,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#FDF5E6',
    borderBottomWidth: 1,
    justifyContent: 'center',
    height: 52,
},
  thumbnail: {
    width: 30,
    height:30,
  },
  list: {
    padding: 4,
    // backgroundColor: '#F5FCFF'
  },
  standaloneRowBack: {
        alignItems: 'center',
        backgroundColor: '#8BC645',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15
  },
  backRightBtn: {
        height:52,
        alignItems: 'center',
        bottom: 0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 75
    },
    backRightBtnLeft: {
        backgroundColor: '#00BFFF',
        right: 75
    },
    backRightBtnRight: {
    backgroundColor: 'red',
        right: 0
  },
  plusBtn: {
    zIndex: 10,
    width: 60,
    height: 60,
    lineHeight: 60,
    right: -280, // -300 靠右
    bottom: 20
  },
  plus: {
    fontSize: 30,
    color: '#fff',
    marginLeft: 19
  }
});