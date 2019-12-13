import React, {
     Component,
} from 'react';
import {
     Dimensions,
     StyleSheet,
     Text,
     ToastAndroid,
     View,
     RefreshControl,
     ScrollView,
     Image,
     TouchableOpacity,
     PermissionsAndroid
} from 'react-native';
import { Spinner, Root, Button as NbButton, Fab as NBFab, Icon as NBIcon, CheckBox as NBCheckBox} from 'native-base';
import dayjs from 'dayjs';
import { SwipeListView } from 'react-native-swipe-list-view';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'rn-fetch-blob';
import RNFileSelector from 'react-native-file-selector';
import CardDialog from '../../components/CardDialog';
import request from '../../utils/request';
import { getFileType } from '../../utils/file';
import imgSite from '../../assets/index';

const path = require('path');

// const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export default class VideoList extends Component {

    static navigationOptions = ({ navigation }) => {
        return {
          headerRight: (
            <TouchableOpacity onPress={navigation.getParam('navigatePress')}>
              <Text style={{fontSize: 16, color: '#fff',marginRight: 8,}}>{navigation.getParam('textVal', '操作')}</Text>
            </TouchableOpacity>
          ),
        };
      };

     constructor(props) {
          super(props);
          this.state = {
               listViewData: [],
               path: '/', // 代表在该用户视频根目录
               isLoading: true, // 正在获取数据
               isUploading: false, // 正在上传
               isRefreshing: false, // 下拉刷新
               modalVisible: false,
                inputVal: '',
                hasInputText: false,
                confirmText: '',
                videoIndex: '',
                videoRowMap: {},
                isCanSwipeLeft: true,
                isAllSelected: false,
                active: false,
          };
     }

     componentDidMount() {
        this.fetchData();
        this.props.navigation.setParams({ navigatePress: this.operate.bind(this) });
      }
      // 操作
      operate () {
          if (this.state.listViewData.length > 0) {
              this.setState({isCanSwipeLeft: !this.state.isCanSwipeLeft});
              this.props.navigation.setParams({ textVal: this.state.isCanSwipeLeft ? '取消' : '操作' });
          } else {
            ToastAndroid.show('无视频可操作',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
          }
      }
      checkPress (item) {
          const isChecked = !item.checked;
          const listViewData = this.state.listViewData;
          listViewData.forEach(o => {
              if(o.key === item.key) {
                  o.checked = isChecked;
              }
          });
          this.setState({listViewData: listViewData});
          const checkIndex = this.state.listViewData.findIndex((item, index, arr) => item.checked === false);
          if (checkIndex > -1) {
            this.setState({isAllSelected: false});
          } else {
            this.setState({isAllSelected: true});
          }
      }

      // 全选或不选
      allSelect () {
        const isAllSelected = !this.state.isAllSelected;
        const listViewData = this.state.listViewData;
        listViewData.forEach(o => {
            o.checked = isAllSelected;
        });
        this.setState({
            listViewData: listViewData,
            isAllSelected
        });
      }
    //   弹出删除
    canDelete () {
        const checkIndex = this.state.listViewData.findIndex((item, index, arr) => item.checked === true);
        if (checkIndex > -1) {
            this.setState({
                modalVisible: true,
                dialogType: 'DeleteByCheck',
                confirmText: '确定删除？',
                hasInputText: false
            });
        }
        else {
            ToastAndroid.show('请选择文件',
                ToastAndroid.SHORT,
                ToastAndroid.CENTER
              );
        }
    }
      // 根据勾选删除
      deleteByCheck () {
        this.setModalVisible(false);
        this.state.listViewData.forEach(o => {
            if (o.checked) {
                const reqObj = {
                    url: '/video/deleteFile',
                    method: 'POST',
                    data: {
                        path: o.url,
                        id: o.id,
                    }
                    };
                    request(reqObj).then(response => {
                    if (response.data.code === 0) {
                        ToastAndroid.show(response.data.message,
                            ToastAndroid.SHORT,
                            ToastAndroid.CENTER
                            );
                        this.fetchData();
                    }
                    });
            }
        });
        if (this.state.isAllSelected) {
            this.setState({
                isCanSwipeLeft: true,
                isAllSelected: false
            });
            this.props.navigation.setParams({ textVal: this.state.isCanSwipeLeft ? '取消' : '操作' });
        }
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
 setModalVisible(v) {
    this.setState({
      modalVisible: v
    });
  }
      // 获取视频列表
      fetchData() {
        const reqObj = {
          url: '/video/queryAll',
          method: 'POST',
          data: {
            path: this.state.path
          }
        };
        request(reqObj).then(async (response) => {
          const res = response.data;
          if (res.code === 0) {
            const videoArr = res.data;
            this.setState({
                listViewData: []
            });
            for (let i = 0; i < videoArr.length; i ++) {
                const iconType = getFileType(videoArr[i].video_name);
              await this.setState({
                listViewData: [...this.state.listViewData, Object.assign({}, {
                  name: videoArr[i].video_name,
                  url: videoArr[i].video_path,
                  key: videoArr[i].video_id.toString(),
                  id: videoArr[i].video_id,
                  icon: imgSite[iconType],
                  time: videoArr[i].video_time,
                  checked: false,
                })]
              });
            }
            this.setState({isLoading: false});
          } else {
            this.setState({isLoading: false});
          }
        });
      }

     closeRow(rowMap, rowKey) {
          if (rowMap[rowKey]) {
               rowMap[rowKey].closeRow();
          }
     }

     // 删除视频
     deleteRow() {
        this.setModalVisible(false);
        this.closeRow(this.state.videoRowMap, this.state.videoIndex);
          const newData = [...this.state.listViewData];
          const prevIndex = this.state.listViewData.findIndex(item => item.key === this.state.videoIndex);
          const reqObj = {
            url: '/video/deleteFile',
            method: 'POST',
            data: {
              path: newData[prevIndex].url,
              id: newData[prevIndex].id,
            }
          };
          request(reqObj).then(response => {
            if (response.data.code === 0) {
                ToastAndroid.show(response.data.message,
                    ToastAndroid.SHORT,
                    ToastAndroid.CENTER
                  );
                this.fetchData();
            }
          });
     }
     // 上传前获取权限
     async getAuthAndUpload () {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission',
              message: 'App needs access to memory to download the file '
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.uploadAudio();
          } else {
            console.log(
              'Permission Denied!',
              'You need to give storage permission to download the file'
            );
          }
     }
     // 上传音频
     uploadAudio () {
        this.setState({ active: !this.state.active });
        RNFileSelector.Show(
            {
                path: `${RNFetchBlob.fs.dirs.SDCardDir}/tencent/MicroMsg/Download`,
                filter: '.*\\.mp3',
                title: '请选择文件',
                onDone: (filePath) => {
                    this.setState({isUploading: true});
                    let data = new FormData();
                    let file = { uri: 'file://' + filePath, type: 'multipart/form-data', name: escape(path.basename(filePath))};
                    data.append('video', file);
                    let options = {
                        url: '/video/addVideo',  // 请求 url
                        data: data,
                        tipFlag: true, // 默认统一提示，如果需要自定义提示，传入 true
                    };
                    request(options).then((res) => {
                        this.setState({isUploading: false});
                        if (res.status == 200) {
                            this.fetchData();
                        }
                    });
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

     // 上传视频
     uploadVideo() {
        this.setState({ active: !this.state.active });
        ImagePicker.openPicker({
            mediaType: 'video',
            cropping: false,
          }).then((video) => {
            this.setState({isUploading: true});
            let data = new FormData();
            let file = { uri: video.path, type: 'multipart/form-data', name: escape(path.basename(video.path)) };
            data.append('video', file);
            let options = {
                url: '/video/addVideo',  // 请求 url
                data: data,
                tipFlag: true, // 默认统一提示，如果需要自定义提示，传入 true
            };
            request(options).then((res) => {
                this.setState({isUploading: false});
                if (res.status == 200) {
                    this.fetchData();
                }
            });
          });
      }

    renderLoadingView() {
        return (
          <View style={styles.container}>
            <Spinner color='#00BFFF' />
            {this.state.isLoading ? <Text>正在加载视频数据...</Text> : null}
            {this.state.isUploading ? <Text>正在上传中...</Text> : null}
          </View>
        );
      }
     render() {
        if (this.state.isLoading || this.state.isUploading) {
            return this.renderLoadingView();
          }

          return (
            <Root>
                {
                    this.state.isCanSwipeLeft ? null :
                    <View style={{ justifyContent: 'flex-end', flexDirection:'row',height: 40, borderBottomColor: '#FDF5E6',
                                borderBottomWidth: 1,alignItems:'center',paddingLeft: 10}}>
                            <Text style={{marginRight:8}}>删除</Text>
                            <NBIcon active type="AntDesign" name="delete"
                                style={{fontSize: 22,color:'red',marginRight:40}}
                                onPress={()=> this.canDelete()}/>
                            <View style={{flexDirection:'row',width:60,marginRight:8}}>
                                <Text style={{}}>全选</Text>
                                <NBCheckBox checked={this.state.isAllSelected}
                                    onPress={()=> {this.allSelect();}}/>
                            </View>
                    </View>
                }
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={this.state.isRefreshing}
                            onRefresh={this._onRefresh}
                            tintColor="red"
                            title="下拉刷新"
                            titleColor="black"
                        />
                    }>
                    {
                        this.state.listViewData.length > 0 ?
                        <SwipeListView
                            style={styles.list}
                            useFlatList={true}
                            data={this.state.listViewData}
                            disableLeftSwipe={!this.state.isCanSwipeLeft}
                            renderItem={ (rowData) => (
                            <View style={styles.rowFront}>
                                <View style={{width:screenWidth,height: 52, flexDirection: 'row',
                                    alignItems:'center',paddingLeft: 10,}}>
                                    <Image
                                        source={ rowData.item.icon }
                                        style={styles.thumbnail}
                                    />
                                    <TouchableOpacity style={{
                                        width: screenWidth - 120,height:52,
                                        flexDirection: 'column', justifyContent: 'center',paddingLeft:10}}
                                        disabled={!this.state.isCanSwipeLeft}
                                        onPress={ () => this.props.navigation.navigate('VideoPlayer', {url: rowData.item.url, title: rowData.item.name, id: rowData.item.id}) }>
                                        <Text style={{marginBottom: 2,fontSize:15}}>{rowData.item.name}</Text>
                                        <Text style={{color:'grey',fontSize:12,}}>{dayjs(rowData.item.time).format('YYYY-MM-DD HH:mm:ss')}</Text>
                                    </TouchableOpacity>
                                    {
                                        this.state.isCanSwipeLeft ? null :
                                        <NBCheckBox style={{width: 20,marginLeft:40,}}
                                            checked={rowData.item.checked}
                                            onPress={() => this.checkPress(rowData.item)}/>
                                    }
                                </View>
                            </View>
                            )}
                            renderHiddenItem={ (rowData, rowMap) => (
                                <View style={styles.rowBack}>
                                    <NbButton style={[styles.backRightBtn, styles.backRightBtnRight]} onPress={() => {
                                        this.setState({
                                            modalVisible: true,
                                            videoIndex: rowData.item.key,
                                            videoRowMap: rowMap,
                                            dialogType: 'Delete',
                                            confirmText: '确定删除？',
                                            hasInputText: false
                                        });
                                        }}>
                                        <Text style={styles.backTextWhite}>删除</Text>
                                    </NbButton>
                                </View>
                            )}
                            rightOpenValue={-75}
                            disableRightSwipe={true}
                        /> : <View style={{flexDirection:'column',justifyContent:'center',alignItems:'center',height:screenHeight - 60}}>
                            <NBIcon active type="Entypo" name="video"
                                style={{fontSize: 60,color:'#CCCCCC', marginBottom: 16}}/>
                            <Text style={{color:'#CCCCCC',fontSize:18}}>暂无视频</Text>
                        </View>
                    }
                </ScrollView>
                <CardDialog
                    modalVisible={this.state.modalVisible}
                    hasInputText={this.state.hasInputText}
                    confirmText={this.state.confirmText}
                    dialogType={this.state.dialogType}
                    onSetModalVisible={(v) => this.setModalVisible(v)}
                    onDelete={() => this.deleteRow()}
                    onDeleteByCheck={() => this.deleteByCheck()}/>
                <NBFab
                    active={this.state.active}
                    direction="up"
                    containerStyle={{ }}
                    style={{ backgroundColor: '#3eb4ff' }}
                    position="bottomRight"
                    onPress={() => this.setState({ active: !this.state.active })}>
                    <NBIcon type="AntDesign" name="plus" />
                    <NbButton style={{ backgroundColor: '#34A34F' }} onPress={() => this.uploadVideo()}>
                        <NBIcon type="FontAwesome" name="file-video-o" />
                    </NbButton>
                    <NbButton style={{ backgroundColor: '#3B5998' }} onPress={() => this.getAuthAndUpload()}>
                        <NBIcon type="FontAwesome" name="file-audio-o" />
                    </NbButton>
                </NBFab>
            </Root>
          );
     }
}

const styles = StyleSheet.create({
     container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
     },
     backTextWhite: {
          color: '#FFF'
     },
     list: {
        padding: 4,
     },
     rowFront: {
        padding:1,
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomColor: '#FDF5E6',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 52,
    },
    thumbnail: {
        width: 30,
        height:30,
      },
     rowBack: {
          alignItems: 'center',
          backgroundColor: '#DDD',
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: 15,
     },
     backRightBtn: {
          alignItems: 'center',
          bottom: 0,
          justifyContent: 'center',
          position: 'absolute',
          top: 0,
          width: 75,
          height:52,
     },
     backRightBtnRight: {
          backgroundColor: 'red',
          right: 0
     },
});