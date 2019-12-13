import { StyleSheet } from 'react-native';
import screen from '../../../utils/screen';
export default StyleSheet.create({
    swtichView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 1,
        height: 48
    },
    switchImg: {
        width: 36,
        height: 36,
        marginLeft: 15,
    },
    switchText: {
        width: screen.width - 130,
        fontSize: 14,
        color: '#666',
        marginLeft: 15
    },
    version: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    iconInfo: {
        backgroundColor: '#ff0000',
        height: 20,
        width: 18,
        borderRadius: 30,
        marginLeft: 15
    },
    iconText: {
        color: '#fff',
        alignSelf: 'center'
    },
    iconRight: {
        marginLeft: 10,
        fontSize: 25,
        color: '#999',
    },
    logoutBtn: {
        marginTop: 20,
        alignSelf: 'center',
        width: screen.width - 40,
    },
    versionView: {
        marginTop: 15,
        marginLeft: 15,
        marginBottom: 0
    },
    versionTitle: {
        fontSize: 16,
    },
    versionContext: {
        marginTop: 10,
        marginBottom:10,
        marginLeft:4,
        fontSize: 14,
        color: '#666'
    },
    upgradeView: {
        marginTop: 15,
        marginLeft: 15,
        marginBottom: 0
    },
    upgradeTitle: {
        fontSize: 18,
    },
    upgradeTitle2:{
        marginTop:10,
        fontSize: 16,
    },
    upgradeContext: {
        marginTop: 5,
        marginLeft:5,
        fontSize: 14,
        color: '#666'
    }
});