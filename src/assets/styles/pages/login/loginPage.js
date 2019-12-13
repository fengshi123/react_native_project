import { StyleSheet } from 'react-native';
import screen from '../../../../utils/screen';

export default StyleSheet.create({
    bg:{
        width: screen.width,
        height: screen.height,
        position: 'absolute'
    },
    main:{
        flex: 1
    },
    title:{
        width: 100,
        fontSize: 20,
        color: '#fff',
        marginLeft: 85
    },
    img:{
        width: 70,
        height: 37,
        marginLeft: 30
    },
    head:{
        width: 250,
        height: 100,
        alignSelf: 'center',
        marginTop: 50,
        borderLeftWidth: 1,
        borderLeftColor: '#fff',
        borderRadius: 1
    },
    headText:{
        fontSize: 25,
        color: '#fff',
        marginLeft: 30
    },
    loginText:{
        fontSize: 15,
        color: '#fff',
        marginLeft: 30,
        opacity: 0.7
    },
    spinkit:{
        position: 'absolute',
        top: 65,
        right: 40
    },
    userPassword:{
        width: 320,
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 30
    },
    input:{
        width: 320,
        height: 50,
        marginTop: 20,
        flexDirection: 'row',
    },
    icon:{
        width: 45,
        marginTop: 15,
        marginLeft: 20,
        color: '#fff'
    },
    inputBorder:{
        width: 220,
        borderBottomWidth: 0.5,
        borderColor: '#eeeeee'
    },
    block:{
        marginTop:50,
        height: 100,
    },
    nbButton:{
        width: 310,
        alignSelf: 'center',
        marginTop: 25,
        justifyContent: 'center',
        backgroundColor: '#3eb4ff'
    },
    buttonText:{
        fontSize: 18,
        color: '#fff'
    },
    row:{
        marginTop: 20,
        marginBottom: 50,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    text:{
        fontSize: 15,
        color: '#fff'
    }
});