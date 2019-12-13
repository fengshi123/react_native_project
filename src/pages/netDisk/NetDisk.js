import React, { Component } from 'react';

import { SwipeListView } from 'react-native-swipe-list-view/lib/index';
import { Dimensions, Image, Text, View, ToastAndroid, RefreshControl,
    ScrollView, TouchableHighlight, PermissionsAndroid, } from 'react-native';
import { Spinner, Root, Button as NbButton, Icon as NBIcon, Fab as NBFab, ActionSheet as NBActionSheet} from 'native-base';
import {
    Menu,
    MenuProvider,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';
import RNFetchBlob from 'rn-fetch-blob';
import RNFileSelector from 'react-native-file-selector';
import ImagePicker from 'react-native-image-crop-picker';
import OpenFile from 'react-native-doc-viewer';
import dayjs from 'dayjs';
import imgSite from '../../assets/index';
import request from '../../utils/request';
import styles from '../../assets/styles/pages/netDisk/netDisk';
import CardDialog from '../../components/CardDialog';
import PictureView from '../../components/common/PictureView';

import { getFileType, getMimeType } from '../../utils/file';
import CONSTANT from '../../utils/constant';
const path = require('path');
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

export default class netDisk extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      filesList: [],
      isSortByName: true, // 按名称排序
      loaded: false,
      refreshing: false,
      modalVisible: false,
      inputVal: '',
      hasInputText: false,
      confirmText: '',
      fileItem: {},
      path: '/', // '/' 代表在该用户网盘根目录
      dirList: [],
      dialogType: '', 
      isRefreshing: false,
      active: false,
      images: [], // 预览的图片
      imgIndex: 0, // 从第几张开始预览
      imgModalVisible: false,
      animating: false,
      fileIndex: '', // 用于关闭侧滑
      fileRowMap: {}, // // 用于关闭侧滑
      isSideSlip: false
    }; 

    this.fetchData = this.fetchData.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.setConfirmText = this.setConfirmText.bind(this);
    this.setHasInputText = this.setHasInputText.bind(this);
    this.delete = this.delete.bind(this);
    this.new = this.new.bind(this);
    this.commonRequest = this.commonRequest.bind(this);
    this.setInputVal = this.setInputVal.bind(this);
    this.namedJudge = this.namedJudge.bind(this);
    this.setDialogType = this.setDialogType.bind(this);
  }
  componentDidMount() {
    this.fetchData();
  }

  setModalVisible = (visible) => {
    this.setState({
      modalVisible: visible
    });
    if (this.state.isSideSlip) {
        this.closeRow(this.state.fileRowMap, this.state.fileIndex);
    }
  }

  setHasInputText(has) {
    this.setState({
      hasInputText: has
    });
  }

  setConfirmText(txt) {
    this.setState({
      confirmText: txt
    });
  }

  setFileItem(data) {
    this.setSate({
      tfileItem: data
    });
  }

  setInputVal(val) {
    this.setState({
      inputVal: val
    });
  }

  setDialogType(type) {
    this.setState({
      dialogType: type
    });
  }

  rename = () => {
      // 输入文件名称时不用包含后缀
      let newName = this.state.inputVal;
      if (this.state.fileItem.name.indexOf('.') > 0 && this.state.inputVal.indexOf('.') < 0) {
        const fileType = this.state.fileItem.name.split('.').pop();
        newName = this.state.inputVal + '.' + fileType;
      }
    const oldName = this.state.fileItem.name;
    if (newName === oldName) {
      ToastAndroid.show(
        '原文件（夹）名与重命名相同',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return;
    }
    if (this.namedJudge(newName)) {
      return;
    }
    let reqUrl = '/files/renameFile';
    let body = {
      old_name: oldName,
      new_name: newName
    };
    this.commonRequest(reqUrl, body);
  }

  namedJudge (newName) {
    let isInvalid = false;
    for (let item of this.state.filesList) {
      if (newName === item.name) {
        ToastAndroid.show(
          '操作失败，已有同名文件(夹)',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        isInvalid = true;
        return isInvalid;
      }
    }
  }

  // 关闭侧滑
  closeRow(rowMap, rowKey) {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    }
  // 删除文件
  delete() {
    let reqUrl;
    if (this.state.fileItem.type === 'dir') {
      reqUrl = '/files/deleteDir';
    } else {
      reqUrl = '/files/deleteFile';
    }
    let body = {
      name: this.state.fileItem.name
    };
    this.commonRequest(reqUrl, body);
  }

  new() {
    let newName = this.state.inputVal;
    if (this.namedJudge(newName)) {
      return;
    }

    let reqUrl = '/files/newDir';
    let body = {
      name: this.state.inputVal
    };
    this.commonRequest(reqUrl, body);
  }

  commonRequest (reqUrl, body) {
    body.path = this.state.path;
    let options = {
      url: reqUrl,
      method: 'POST',
      data: body
    };
    request(options).then(res => {
      this.setModalVisible(false);
      if (res.data.code === 0) {
        ToastAndroid.show(res.data.message,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        this.fetchData();
      }
    });
  }
  //下拉刷新
  _onRefresh = async ()=>{
    this.setState({
        isRefreshing: true
    });
    await this.fetchData();
    this.setState({
        isRefreshing: false
    });
 }
 // 下载文件
 async downloadFile(item) {
    const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage Permission',
          message: 'App needs access to memory to download the file '
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.actualDownload(item);
      } else {
        console.log(
          'Permission Denied!',
          'You need to give storage permission to download the file'
        );
      }
 }
// 文件排序
 async sortFile () {
    this.setState({
        isSortByName:!this.state.isSortByName
    }, () => {
        this.fileSort(this.state.isSortByName);
    });
 }

 // 关闭图片modal
closeImg() {
    this.setState({
        imgIndex: 0,
        imgModalVisible: false
    });
}

// 获取图片数组
getImageList () {
    const images = [];
    this.state.filesList.forEach((o) => {
        if (o.type === 'img') {
            images.push({
                url: `${CONSTANT.SERVER_URL}${o.path}`,
                name: o.name
            });
        }
    });
    this.setState({
        images
    });
}
 // 预览
async Preview (item) {
    const docArr = ['doc', 'txt', 'xls', 'ppt', 'pdf', 'xml'];
     if (item.type === 'img') {
        await this.getImageList();
        this.state.images.forEach((o, index) => {
            if (o.name === item.name) {
                this.setState({
                    imgIndex: index,
                    imgModalVisible: true
                });
            }
        });
     } else if (item.type === 'video' || item.type === 'audio') {
        ToastAndroid.show('音视频播放请前往"视听空间"', ToastAndroid.SHORT);
     } else if (docArr.includes(item.type)) {
         if (item.name.indexOf('.') > 0) {
            this.setState({animating: true});
             OpenFile.openDoc([{
                url: `${CONSTANT.SERVER_URL}${item.path}`,
                fileName: item.name.split('.').shift(),
                cache: false,
                fileType: item.name.split('.').pop()
            }], (error) => {
                if (error) {
                    this.setState({ animating: false });
                    console.log(error);
                    ToastAndroid.show('请先安装相关应用软件', ToastAndroid.SHORT);
                } else {
                    this.setState({ animating: false });
                    // ToastAndroid.show('该文件不支持预览', ToastAndroid.SHORT);
                }
            });
         } else {
            ToastAndroid.show('该文件不支持预览', ToastAndroid.SHORT);
         }
     } else {
        ToastAndroid.show('该文件暂不支持预览', ToastAndroid.SHORT);
     }
 }

 async actualDownload(item) {
    let dirs = RNFetchBlob.fs.dirs;
    const android = RNFetchBlob.android;
    RNFetchBlob.config({
        fileCache : true,
        path: `${dirs.DownloadDir}/${item.name}`,
        // android only options, these options be a no-op on IOS
        addAndroidDownloads : {
          // Show notification when response data transmitted
          notification : true,
          // Title of download notification
          title : '下载完成',
          // File description (not notification description)
          description : 'An file.',
          mime : getMimeType(item.name.split('.').pop()),
          // Make the file scannable  by media scanner
          mediaScannable : true,
        }
      })
      .fetch('GET', `${CONSTANT.SERVER_URL}${item.path}`)
      .then(async(res) => {
            ToastAndroid.show('已保存到文件管理器的 Download 文件夹', ToastAndroid.LONG);
            await android.actionViewIntent(res.path(), getMimeType(item.name.split('.').pop()));
        }).catch((error) => {
            console.log(error.message);
            ToastAndroid.show('请先安装相应应用', ToastAndroid.SHORT);
        });
 }

// 打开上传类型
 creatAndUpload() {
    let BUTTONS = [
        { text: '新建文件夹', icon: 'folder', iconColor: '#f42ced'},
        { text: '单张/多张图片', icon: 'image', iconColor: '#2c8ef4' },
        { text: '微信文件', icon: 'document', iconColor: '#25de5b' },
        { text: '文件管理器', icon:'filing', iconColor: '#ea943b' },
        { text: '取消', icon: 'close', iconColor: '#99CCCC' }
    ];
    NBActionSheet.show(
        {
            options: BUTTONS,
            title: '新建/上传',
            destructiveButtonIndex: 1
        },
        async (buttonIndex) => {
            if (buttonIndex === 0) {
                this.setState({
                    modalVisible: true,
                    hasInputText: true,
                    dialogType: 'New'
                });
            } else if (buttonIndex === 1) {
                this.imagePick();
            } else {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                    {
                      title: 'Storage Permission',
                      message: 'App needs access to memory to download the file '
                    }
                  );
                  if (granted === PermissionsAndroid.RESULTS.GRANTED && buttonIndex === 2) {
                    this.openFileManager(`${RNFetchBlob.fs.dirs.SDCardDir}/tencent/MicroMsg/Download`);
                  } else if (granted === PermissionsAndroid.RESULTS.GRANTED && buttonIndex === 3) {
                    this.openFileManager(RNFetchBlob.fs.dirs.SDCardDir);
                  } else {
                    console.log(
                      'Permission Denied!',
                      'You need to give storage permission to download the file'
                    );
                  }
            }
        }
    );
 }

// 从微信、文件管理器选择文件
 openFileManager (selectPath) {
    RNFileSelector.Show(
        {
            path: selectPath,
            title: '请选择文件',
            onDone: (filePath) => {
                const fileUri = 'file://' + filePath;
                this.fileRequest(fileUri);
            },
            onCancel: () => {
                ToastAndroid.show(
                    '取消上传',
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                    );
            }
        }
    );
 }

// 图片选择
imagePick () {
    ImagePicker.openPicker({
        multiple: true,
        width: 300,
        height: 400,
        mediaType: 'photo',
        cropping: true,
      }).then((images) => {
        for (let i = 0; i < images.length; i ++) {
            this.fileRequest(images[i].path);
        }
      });
}
// 文件请求接口
fileRequest (filePath) {
    const str = `/${this.state.dirList.join('/')}` || '/';
    let body = {};
    body.path = str;
    let options = {
       url: '/files/getFilePath',  // 请求 url
       data: body,
       method: 'POST'
   };
   request(options).then(async (res) => {
       if (res.status == 200) {
            let data = new FormData();
            let file = { uri: filePath, type: 'multipart/form-data', name: escape(path.basename(filePath))};
            data.append('file', file);
            let options = {
                url: '/files/uploadFile',  // 请求 url
                data: data,
                tipFlag: true, // 默认统一提示，如果需要自定义提示，传入 true
            };
            request(options).then(async (res) => {
                if (res.status == 200) {
                    await this.fetchData();
                    ToastAndroid.show(
                        '上传成功',
                        ToastAndroid.SHORT,
                        ToastAndroid.CENTER
                        );
                }
            });
       }
   });
}

  fetchData() {
    const reqObj = {
      url: '/files/queryAll',
      method: 'POST',
      data: {
        path: this.state.path
      }
    };
    request(reqObj).then(async (response) => {
      const res = response.data;
      if (res.code === 0) {
        const data = res.data;
        const stats = data.stats;
        this.setState({
          filesList: []
        });
        for (let i = 0; i < stats.length; i ++) {
          const name = stats[i].path.split('/').pop();
          const iconType = stats[i].mime_type === 'dir' ? 'dir' : getFileType(name);
          this.setState({
            filesList: [...this.state.filesList, Object.assign({}, {
              name: name,
              type: iconType,
              icon: imgSite[iconType],
              path: stats[i].path,
              time: stats[i].atimeMs,
              key: name + String(i)
            })]
          });
        }
        await this.fileSort(this.state.isSortByName);
        this.setState({
          loaded: true
        });
      }
    });
  }

  // 文件、文件夹分类排序
async fileSort (isSortByName) {
    let filesList = this.state.filesList;
    let dirArr = [];
    let fileArr = [];
    filesList.forEach(item => {
        if (item.type === 'dir') {
            dirArr.push(item);
        } else {
            fileArr.push(item);
        }
    });
    if (isSortByName) {
        const arr1 = this.sortName(dirArr);
        const arr2 = this.sortName(fileArr);
        this.setState({
            filesList: [].concat(arr1,arr2)
        });
    } else {
        const arr1 = this.sortTime(dirArr);
        const arr2 = this.sortTime(fileArr);
        this.setState({
            filesList: [].concat(arr1,arr2)
        });
    }
}

// 按名称排序
sortName (list) {
    let chineseChars=[];
    let chars=[];
    list.forEach(item => {
        // 判断是否为中文
        if(/^[\u4e00-\u9fa5]*$/.test(item.name.charAt(0))) {
        chineseChars.push(item); // 中文
        } else {
            chars.push(item); // 字母，数字
        }
    });
    chars.sort(this.sortChart);
    chineseChars.sort((a,b) => a.name.localeCompare(b.name));
    return chars.concat(chineseChars);
}
// 字符数字混排
sortChart(a, b){
    if (/^\d/.test(a.name) ^ /^\D/.test(b.name)) return a.name > b.name ? 1 : (a.name === b.name ? 0 : -1);
    return a.name > b.name ? -1 : (a.name === b.name ? 0 : 1);
}

// 按时间排序
sortTime (list) {
    list.sort((a,b) => b.time - a.time);
    return list;
}
// 点击进入深层文件夹
getDirFile (item) {
    if (item.type === 'dir') {
        let pathArr = item.path.split('/');
        pathArr = pathArr.slice(4);
        const pathStr = pathArr.join('/');
        this.setState({
            path: `/${pathStr}/`,
            dirList: pathArr
        }, () => {this.fetchData();});
    } else {
        this.Preview(item);
    }
}
// 返回某层目录
backDir (info) {
    if (info === '/') {
        this.setState({
            path: '/',
            dirList: []
        }, () => {this.fetchData();});
    } else {
        const pathIndex = this.state.dirList.findIndex((item, index, arr) => item === info);
        const pathArr = this.state.dirList.slice(0, pathIndex + 1);
        const pathStr = pathArr.join('/');
        this.setState({
            path: `/${pathStr}/`,
            dirList: pathArr
        }, () => {this.fetchData();});
    }
}

  render() {
    if (!this.state.loaded) {
      return this.renderLoadingView();
    }

    return (
      <Root>
          <View style={{ justifyContent: 'space-between', flexDirection:'row',height: 40, borderBottomColor: '#FDF5E6',
                            borderBottomWidth: 1,alignItems:'center',paddingLeft: 10}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                        <Text onPress={() => this.backDir('/')}>根目录</Text>
                        {this.state.dirList.length > 0 ? this.state.dirList.map((info, index) => {
                            return (
                                <View key={index} style={{flexDirection:'row',alignItems:'center'}} >
                                    <Text style={{color:'grey'}}> &gt;</Text>
                                    <Text style={{marginLeft:6}}
                                        disabled={this.state.dirList.length - 1 === index}
                                        onPress={() => this.backDir(info)}>{info}</Text>
                                </View>
                                );
                        }) : null}
                    </View>
                    <NbButton transparent small
                        style={{ backgroundColor: '#fff',width: 65,height: 30,border:0, margin:0,}}
                        onPress={() => this.sortFile()}>
                        <Text style={{marginRight:-10,padding:0}} >{this.state.isSortByName ? '名称':'时间'}</Text>
                        <NBIcon type="MaterialCommunityIcons" name="format-list-bulleted-type" style={{ fontSize: 20, color:'#3B5998',margin:0,padding:0}}/>
                    </NbButton>
            </View>
            {
                this.state.filesList.length > 0 ?
                    <ScrollView
                        refreshControl={
                                <RefreshControl refreshing={this.state.isRefreshing}
                                    onRefresh={this._onRefresh}
                                    tintColor="red"
                                    title="下拉刷新"
                                    titleColor="black"
                                />
                            }>
                        <MenuProvider style={{flexDirection: 'column',minHeight: screenHeight - 50}}>
                            <SwipeListView
                                style={styles.list}
                                data={this.state.filesList}
                                renderItem={ (rowData) => (
                                    <TouchableHighlight
                                        style={styles.rowFront}
                                        underlayColor={'#AAA'}
                                    >
                                        <View style={{flexDirection:'row',flex: 1,alignItems:'center'}}>
                                            <Menu
                                                style={{ height: 52,flex:1}}>
                                                <MenuTrigger
                                                    style={{ height: 52, flexDirection: 'row',alignItems:'center',padding: 10,justifyContent:'space-between'}}
                                                    onAlternativeAction={() => this.getDirFile(rowData.item)}
                                                    triggerOnLongPress={true}
                                                    customStyles={triggerStyles}>
                                                    <Image
                                                        source={ rowData.item.icon }
                                                        style={styles.thumbnail}
                                                    />
                                                    <View style={{width: screenWidth - 68,height:52,flexDirection: 'column', justifyContent: 'center',paddingLeft:10}}>
                                                        <Text style={{marginBottom: 2,fontSize:15}}>{rowData.item.name}</Text>
                                                        <Text style={{color:'grey',fontSize:12,}}>{dayjs(rowData.item.time).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                                    </View>
                                                    <View style={{width:18}}>
                                                        {
                                                            rowData.item.type === 'dir'?
                                                            <NBIcon type="AntDesign" name="right" style={{fontSize:16, color: '#C0C4CC'}}/> : null
                                                        }
                                                    </View>
                                                </MenuTrigger>
                                                <MenuOptions customStyles={optionsStyles}>
                                                    <MenuOption value={1} text='重命名' onSelect={() => {this.setState({
                                                        modalVisible: true,
                                                        fileItem: rowData.item,
                                                        dialogType: 'Rename',
                                                        hasInputText: true,
                                                        inputVal: rowData.item.name,
                                                        isSideSlip: false
                                                    });}}/>
                                                    <MenuOption value={2} text='删除' onSelect={() => {
                                                        this.setState({
                                                            modalVisible: true,
                                                            fileItem: rowData.item,
                                                            dialogType: 'Delete',
                                                            confirmText: '确定删除？',
                                                            hasInputText: false,
                                                            isSideSlip: false
                                                        });
                                                    }}/>
                                                    {
                                                        rowData.item.type === 'dir' ? null : <MenuOption value={3} text='下载'
                                                            onSelect={() => this.downloadFile(rowData.item)}/>
                                                    }
                                                </MenuOptions>
                                            </Menu>
                                        </View>
                                    </TouchableHighlight>
                                )}
                                renderHiddenItem={ (rowData, rowMap) => {
                                return (
                                    <View style={styles.standaloneRowBack} key={rowData.item.time}>
                                        <NbButton style={[styles.backRightBtn, styles.backRightBtnLeft]} onPress={() =>{
                                            this.setState({
                                                modalVisible: true,
                                                fileItem: rowData.item,
                                                fileIndex: rowData.item.key,
                                                fileRowMap: rowMap,
                                                dialogType: 'Rename',
                                                hasInputText: true,
                                                inputVal: rowData.item.name,
                                                isSideSlip: true
                                            });
                                        }}>
                                            <Text style={styles.backTextWhite}>重命名</Text>
                                        </NbButton>
                                        <NbButton style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={() => {
                                            this.setState({
                                                modalVisible: true,
                                                fileItem: rowData.item,
                                                fileIndex: rowData.item.key,
                                                fileRowMap: rowMap,
                                                dialogType: 'Delete',
                                                confirmText: '确定删除？',
                                                hasInputText: false,
                                                isSideSlip: true
                                            });
                                            }}>
                                            <Text style={styles.backTextWhite}>删除</Text>
                                        </NbButton>
                                    
                                    </View>
                                );}
                                }
                                rightOpenValue={-150}
                                stopRightSwipe={-150}
                                disableRightSwipe={true}
                                swipeToOpenPercent={20}
                                swipeToClosePercent={0}
                            />
                            </MenuProvider>
                    </ScrollView> : <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',height:screenHeight - 100}}>
                        <NBIcon active type="AntDesign" name="filetext1"
                            style={{fontSize: 60,color:'#CCCCCC', marginBottom: 16}}/>
                        <Text style={{color:'#CCCCCC',fontSize:18}}>暂无文件</Text>
                    </View>
            }
        <CardDialog
            modalVisible={this.state.modalVisible}
            hasInputText={this.state.hasInputText}
            confirmText={this.state.confirmText}
            dialogType={this.state.dialogType}
            onSetModalVisible={this.setModalVisible}
            onDelete={this.delete}
            onRename={this.rename}
            onNew={this.new}
            onSetInputVal={this.setInputVal}
          >
        </CardDialog>
        <PictureView
            style={{ flex: 1}}
            images={this.state.images}
            imgIndex={this.state.imgIndex}
            imgModalVisible={this.state.imgModalVisible}
            closeImg={() => this.closeImg()}
        />
        {/* <NBFab
            active={this.state.active}
            direction="up"
            containerStyle={{ }}
            style={{ backgroundColor: '#3eb4ff' }}
            position="bottomRight"
            onPress={() => this.setState({ active: !this.state.active })}>
            <NBIcon type="AntDesign" name="plus" />
            <NbButton style={{ backgroundColor: '#34A34F' }} onPress={() => {
                this.setState({
                    modalVisible: true,
                    hasInputText: true,
                    dialogType: 'New',
                    active: !this.state.active
                });
            }}>
                <NBIcon type="AntDesign" name="addfolder" />
            </NbButton>
            <NbButton style={{ backgroundColor: '#3B5998' }} onPress={() => this.uploadFile()}>
                <NBIcon type="AntDesign" name="addfile" />
            </NbButton>
          </NBFab> */}
          <NBFab
              style={{ backgroundColor: '#3eb4ff' }}
              position="bottomRight"
              onPress={ () => this.creatAndUpload()}>
            <NBIcon type="AntDesign" name="plus" />
        </NBFab>
      </Root>
    );
  }

  renderLoadingView() {
    return (
      <View style={styles.container}>
        <Spinner color='#00BFFF' />
        <Text>正在加载网盘数据......</Text>
      </View>
    );
  }
}

const triggerStyles = {
    triggerText: {
      color: 'black',
    },
    triggerOuterWrapper: {
      flex: 1,
    },
    triggerWrapper: {
        paddingLeft:8,
      justifyContent: 'center',
      flex: 1,
    },
    triggerTouchable: {
      activeOpacity: 70,
      style : {
        flex: 1,
      },
    },
  };

  const optionsStyles = {
    optionsContainer: {
        marginTop: -40,

        marginLeft:100,
      width:100,
    //   backgroundColor: 'green',
      padding: 5,
    },
    optionsWrapper: {
    //   backgroundColor: 'purple',
    },
    optionWrapper: {
    //   backgroundColor: 'yellow',
      margin: 5,
    },
    optionTouchable: {
    //   underlayColor: 'gold',
      activeOpacity: 80,
    },
    optionText: {
      color: 'brown',
    },
  };