import { StyleSheet } from 'react-native';

export default StyleSheet.create({
    main:{
        flex: 1, 
    },
    stemImg: {
        width: 50,
        height: 50,
        marginTop: 5,
        marginRight: 2
    },
    stemImgView:{
        flexDirection: 'row',
        margin:10, 
    },
    stemImgAdd:{
        fontSize: 50, 
        color: '#3eb4ff'
    },
    tabs:{
       marginTop:3
    },
    tabsBar:{
        borderBottomWidth:3,
        borderColor:'#3eb4ff',
    },
    tab:{
        backgroundColor:'#fff',
    },
    activeTab:{
        backgroundColor:'#fff',
    },
    tabText:{
        color:'#999',
    },
    activeTabText:{
        color:'#3eb4ff',
    },
    audio:{
        width:48,
        height:48,
        margin:10,
    },
    audioTouch:{
        alignSelf:'center',
    },
    audioView:{
        flexDirection: 'row',
        marginLeft:3,
    },
    audioImg:{
        width:32,
        height:32,
        alignSelf:'center',
    },
    audioText:{
        alignSelf:'center',
    },
    stemAudioView:{
        flexDirection: 'row',
    },
    spinkit:{
        marginLeft:6,
        width:41,
        color:'#3eb4ff'
    }
});