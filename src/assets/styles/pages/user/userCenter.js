import { StyleSheet } from 'react-native';
import screen from '../../../../utils/screen';

export default StyleSheet.create({
    main:{
        backgroundColor:'#f7f7f7',
        height:screen.height
    },
    userMain:{
        flexDirection: 'row',
        backgroundColor:'#fff',
        marginTop:15,
        marginBottom:15
    },
    userAvatar:{
        width: 50, 
        height: 80,
        marginTop:10,
        marginLeft:20,
        marginBottom:10
    },
    userFont:{
        justifyContent:'center',
        height: 90, 
        marginLeft:30,
    },
    userFont1:{
        fontSize: 26,
        height: 40,
        color:'#666'
    },
    userFont2:{
        fontSize:16,
        color: '#999'
    },
    logoutView:{
        marginTop:60,
        alignSelf:'center',
        width:screen.width - 40,
    },
    logoutBtn:{
        backgroundColor:'#3eb4ff',
        justifyContent:'center',
        borderRadius:30
    },
    logoutText:{
        fontSize:18,
        letterSpacing:20,
        color:'#fff'
    }
});