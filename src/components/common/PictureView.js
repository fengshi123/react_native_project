import React from 'react';
import {Modal, CameraRoll, ToastAndroid} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class PictureView extends React.Component {


    constructor(props) {
        super(props);
      }
      // 保存图片
      saveImg(url) {
        let promise = CameraRoll.saveToCameraRoll(url);
        promise.then((result) => {
            console.log(result);
            ToastAndroid.show('已保存到相册', ToastAndroid.SHORT);
         }).catch((error) => {
            console.log(error);
            ToastAndroid.show('保存失败', ToastAndroid.SHORT);
         });
      }
      render() {
        const imgModalVisible = this.props.imgModalVisible; // 是否显示 modal
        const images = this.props.images; //图片数组，[{url:''},{url:''}]
        const imgIndex = this.props.imgIndex; // 被预览图片对应的图片数组位置，0 表示第一张
        return (
          <Modal
              transparent={true}
              visible={imgModalVisible}
              onRequestClose={() => this.props.closeImg()}>
                <ImageViewer
                    onCancel={()=> this.props.closeImg()}
                    onClick={(onCancel) => {onCancel();}}
                    onSave={(url) => this.saveImg(url)}
                    saveToLocalByLongPress={true}
                    imageUrls={images}
                    index={imgIndex}
                    doubleClickInterval={1000}
                    menuContext={{ 'saveToLocal': '保存到相册', 'cancel': '取消' }}/>
              </Modal>
        );
      }
}