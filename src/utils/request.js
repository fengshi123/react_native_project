const axios = require('axios');
import { ToastAndroid } from 'react-native';
import CONSTANT from './constant.js';
import globalVar from './globalVar.js';

export default function request(options) {
    if (!options.url) {
        return;
    }
    options.url = CONSTANT.SERVER_URL + options.url;
    if (!options.method) {
        options.method = 'post';
    }
    axios.defaults.headers.common['Authorization'] = globalVar.token;
    // 拦截器
    axios.interceptors.request.use(function (req) {
        console.log(req);
        return req;
      }, function (error) {
        return Promise.reject(error);
    });

    axios.interceptors.response.use(function (res) {
        console.log(res);
        if(res.data.code && !options.tipFlag){
          ToastAndroid.show('接口请求失败！', ToastAndroid.SHORT);
        }
        return res;
    }, function (err) {
        console.log(err);
        if(!options.tipFlag){
          ToastAndroid.show('接口请求失败！', ToastAndroid.SHORT);
        }
        return Promise.reject(ErrorEvent);
    });
    return axios(options);
}
