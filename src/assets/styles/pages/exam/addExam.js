import { StyleSheet } from 'react-native';
import screen from '../../../../utils/screen';

export default StyleSheet.create({
    main:{
        flex: 1, 
        width: screen.width - 6, 
        backgroundColor:'#f7f7f7',
    },
    name:{
        marginTop:8,
        marginBottom:8,
        backgroundColor:'#fff',
    },
    nameLabel:{
        marginLeft:10,
        color:'#333',
        fontSize:18
    },
    nameInput:{
        marginLeft:-25,
        marginRight:35
    },
    iconSuccess:{
        color: '#5cb85c', 
        position:'absolute',
        right:5
    },
    iconError:{
        color: '#ed2f2f', 
        position:'absolute',
        right:5
    },
    flatListView:{
        flex: 1,
        paddingBottom:40,
        marginBottom:25 ,
        backgroundColor:'#fff',
    },
    sureAdd: {
        marginRight: 8,
        fontSize: 16,
        color: '#fff'
    },
    stemImg: {
        width: 50,
        height: 50,
        marginTop: 5,
        marginRight: 2
    },
    title:{
        flexDirection: 'row',
        height: 40, 
        alignItems: 'center',
        marginLeft:10,
        marginRight:10 
    },
    body:{
        marginLeft:10,
        marginRight:10
    },
    titleNum:{
        fontWeight: 'bold',
        fontSize: 18
    },
    deleteTouch:{
        fontSize: 26, 
        color: '#3eb4ff', 
        right: 1, 
        position: 'absolute' 
    },
    deleteIcon:{
        color: '#3eb4ff'
    },
    textContent:{
        fontSize: 16, 
        color: '#666', 
        height: 30, 
        textAlignVertical: 'center',
    },
    textAnswer:{
        marginTop:10,
        marginBottom:-10,
        fontSize: 16, 
        color: '#666', 
        height: 30, 
        textAlignVertical: 'center',
    },
    fab:{
        backgroundColor: '#3eb4ff'  
    },
    fabIcon:{
        color: '#fff'
    },
    typeBtnTouch:{
        marginLeft: 10
    },
    inputResult:{
        width: 250, 
        borderColor: '#999', 
        borderBottomWidth: 1
    },
    indicatorView:{
        position: 'absolute',
        backgroundColor:'#eee',
        width:screen.width,
        height:screen.height,
        opacity:0.5,
        zIndex:1000,
        alignItems: 'center' 
    },
    indicator:{
        top:screen.height/2-150,
        color:'#3eb4ff'
    },
    indicatorText:{
        top:screen.height/2-135,
        color:'#333',
        fontSize:16
    }
});
