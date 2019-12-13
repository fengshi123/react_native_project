import { StyleSheet } from 'react-native';
import screen from '../../../../utils/screen';

export default StyleSheet.create({
    main: {
        width:screen.width - 20,
        backgroundColor: '#eee',
        marginTop: 10,
        marginLeft: 10,
        borderRadius: 7
    },
    property: {
        width: screen.width - 36,
        // width:325,
        backgroundColor: '#fff',
        padding: 10,
        marginTop: 8,
        flexDirection: 'row',
        alignSelf: 'center'
    },
    label: {
        width: 5,
        height: 25,
        backgroundColor: '#3eb4ff',
        borderRadius: 10
    },
    type: {
        marginLeft: 5,
        fontSize: 18,
        fontWeight:'bold',
        color:'#333'
    },
    questionId: {
        position: 'absolute',
        top: 10,
        right: 25,
        fontSize: 20
    },
    sum: {
        position: 'absolute',
        right: 7,
        top: 15,
        fontSize: 14,
        color: '#777'
    },
    content: {
        backgroundColor: '#fff',
        marginTop: 8,
        width: screen.width - 36,
        marginLeft: 8,
        borderBottomWidth: 1,
        borderColor: '#cecece'
    },
    problem: {
        color: '#636363',
        fontSize: 16,
        marginTop: 10,
        padding: 10
    },
    img: {
        width: 50,
        height: 50,
        marginTop: 5,
        marginLeft: 5,
        marginBottom: 3
    },
    slider:{
        width: 250,
        height: 32,
        alignSelf:'center',
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor:'#3eb4ff',
        width: screen.width - 52,
        fontSize: 16,
        borderRadius: 7,
        marginLeft: 8,
        marginTop: 10
    },
    answer: {
        flexDirection: 'row',
        height: 50
    },
    result: {
        fontSize: 16,
        color: '#ff0000',
        marginLeft: 10,
        marginTop: 15
    },
    wrongIcon: {
        color: '#ff0000',
        position: 'absolute',
        right: 10,
        top: 10
    },
    rightIcon: {
        color: '#1eee0b',
        position: 'absolute',
        right: 10,
        top: 10
    },
    buttonView: {
        marginTop: 20,
        width: screen.width - 50,
        alignSelf: 'center',
        height: 100,
    },
    button:{
        marginTop:20,
        height:40,
        borderRadius:30,
        fontSize:20,
        backgroundColor:'#3eb4ff',
        color:'#3eb4ff',
        justifyContent:'center'
    },
    buttonText:{
        color:'#fff',
        fontSize:16,
    },
    audioView:{
        flexDirection: 'row',
        marginLeft:3,
        marginTop:20
    },
    audioImg:{
        width:32,
        height:32,
        alignSelf:'center',
        marginLeft: 5
    },
    audioText:{
        alignSelf:'center',
    },
    spinkit:{
        marginLeft: 6,
        width: 42,
        color:'#3eb4ff',
        marginTop: 20
    },
    contentView:{
        marginTop:8,
        marginLeft:8,
        paddingBottom:10,
        backgroundColor:'#fff',
        width: screen.width - 36,
    }
});