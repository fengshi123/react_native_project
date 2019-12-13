
import homePage  from './imgPath/homePage';
import netDisk  from './imgPath/netDisk';
import loginPage from './imgPath/loginPage';
import examList from './imgPath/examList';
import userCenter  from './imgPath/userCenter';
import answerQuestion  from './imgPath/answerQuestion';

const imgSite = {
    // 主界面
    ...homePage,
    // 登录
    ...loginPage,
    // 试题
    ...examList,
    ...answerQuestion,
    // 网盘
    ...netDisk,
    // 视听

    // 用户中心
    ...userCenter,
        
};

export default imgSite;