## 一、框架介绍

（1）react-native 项目用得框架以及插件版本号如下所示：

| 工具名称       | 版本号  |
| -------------- | ------- |
| node.js        | 11.12.0 |
| npm            | 6.7.0   |
| yarn           | 1.17.3  |
| Android Studio | 3.4.1   |
| JDK            | 1.8     |
| react          | 16.8.6  |
| react-native   | 0.60.5  |

（2）项目的主要功能点如下：

![1](.\src\assets\images\1.png)

（3）项目完成的一些功能界面如下所示：

![2](.\src\assets\images\2.jpg)



## 二、项目启动

``` bash
1、安装 yarn、react-native 的命令行工具
$ npm install -g yarn react-native-cli

2、安装完 yarn 后需要设置镜像源
$ yarn config set registry https://registry.npm.taobao.org --global
$ yarn config set disturl https://npm.taobao.org/dist --global

3、进入到目录底下，安装插件，例如 react_native_project 目录底下
$ yarn

4、Android Studio 的配置不做介绍（weex 开发过，这一步不需要更改），参照：react-native 官网：https://reactnative.cn/docs/getting-started/

5、编译并运行项目
$ react-native run-android

6、第 5 步后，如果真机或模拟器提示，Metro 没有启动，可关闭第 5 步开启的 node 窗口，再重启 Metro：
$ npm start

7、本项目的服务端接口为本作者的另一开源项目：https://github.com/fengshi123/express_project
```

## 三、项目结构

```
├─ .vscode			编辑器配置						    
├─ android			android 原生目录
├─ ios			    ios 原生目录
├─node_modules		 项目依赖包
├─ src               代码主目录				
│  ├─assets			存放样式文件
│  │  ├─images       存放图片
│  │  └─styles		样式文件的 js 目录
│  │  ├─index.js     存放图片路径，可以参照主页面模块写法
│  ├─components		存放块级组件	
│  ├─navigation		存放导航配置		
│  │  ├─ index.js	导航配置主文件			
│  ├─pages			存放页面级组件，不同模块不同目录
│  └─utils			存放工具方法		
│  │  ├─ constant.js   一些常量配置，例如：服务器 IP 端口等
│  │  ├─ globalVar.js  一些全部变量
│  │  └─ request.js	   ajax 请求			
├─.eslintrc.js		 eslint 配置	
├─.gitignore.js		 git 忽略配置							
├─index.js			项目入口
├─package.json		项目依赖包配置
```



## 四、react 代码规范

### **1、组件文件的代码结构：**

- constructor 
- 钩子函数
- 方法
- jsx

### **2、事件处理的写法**

事件处理有以下 4 种写法：

推荐使用第 3 种，如果向子组件传递回调函数时 ，则使用第 4 种；

```javascript
1、构造函数中绑定  
缺点：不能传特定的参数；
  constructor(props) {
    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
      
    <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
    </button>
  }

2、public class fields 语法
缺点：不能传特定的参数
 handleClick = () => {
    console.log('this is:', this);
 }
 <button onClick={this.handleClick}>
     Click me
 </button>

3、在回调中使用箭头函数
优点：可以传特定参数；rn 的绝大部分 api 写法都是这么写的；
缺点：react 官网中写 该回调函数作为 prop 传入子组件时，这些组件可能会进行额外的重新渲染。

<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>


4、第二种 bind 方式
优点：可以传递特定参数
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```

### **3、state 避免滥用**

更新 state 会对应重新渲染 render，所以对于有些属性，当其值更改时，不需要重新渲染的，那么其没必要放入 state 中；

```
  constructor(props) {
    super(props);
    this.state = { 
     ...
    };
    this.examName = '';
  }
```

### **4、样式写法**

1、样式代码在之前对象的基础上，加上官网建议的 StyleSheet.create（虽然没看出区别，规范下写法）

2、样式导入后，统一用 style 这个变量，容易区分

```javascript
// 样式定义
import { StyleSheet } from 'react-native';
export default StyleSheet.create({
  ....
}）

// 样式导入
 import style from '../../assets/styles/pages/exam/addExam';                                
                                                    
```

### **5、按模块区分**

 页面级组件 pages 、导航配置 navigation 、样式文件 styles/pages 、图片路径配置 styles/index.js



### **6、名称命名**

- 组件名称采用大驼峰命名规则，例如：LoginPage.js
- 其它如变量、其它文件命名等采用小驼峰命名规则，例如：baseStyle.js
- NativeBase 组件库的组件命名进行区分，例如：import { Button as NbButton, Icon as NbIcon, Text as NbText} from 'native-base'; 

### 7、请求模块封装

- 采用 axios 第三方插件；
- options 参数如下：

```javascript
let param = {
  uid: '1',
  password: '111'
};
let options = {
  url: '/getToken',  // 请求 url
  method: 'POST',    // 请求 method，默认 post 类型
  data: param        // 请求携带参数
  tipFlag: false,    // 默认统一提示，如果需要自定义提示，传入 true
};
```

- 封装的请求会 console.log 出每次的请求参数、响应参数；

### 8、设备屏幕的宽高获取

 已经放到 ./utils/screen.js 路径中，有需要的页面可以进行导入；

