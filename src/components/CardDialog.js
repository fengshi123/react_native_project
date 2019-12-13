import React, { Component } from 'react';
import { View, Alert, Modal } from 'react-native';
import { Button as NbButton, Text as NbText, Input } from 'native-base';
import styles from '../assets/styles/components/CardDialog';

export default class CardDialog extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const modalVisible = this.props.modalVisible;
    const hasInputText = this.props.hasInputText;
    const confirmText = this.props.confirmText;
    let inputVal = this.props.inputVal;
    const dialogType = this.props.dialogType;
    return (
      <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            this.props.onSetModalVisible(false);
            }}>
            <View style={styles.modal}>
              <View style={styles.modalContent}>
                {
                  hasInputText ? 
                  <View regular style={styles.input}>
                    <Input autoFocus value={inputVal} placeholder={'请输入名称'} placeholderTextColor="#DCDCDC" onChangeText={(val) => {
                      this.props.onSetInputVal(val);
                    }}/>
                  </View> : <NbText style={styles.confirmDel}>{confirmText}</NbText>
                }
                <View footer style={styles.footer}>
                    <View style={{borderRightWidth:1,borderRightColor:'#EEEEEE', width: 125}}>
                        <NbButton transparent onPress={
                            () => {
                                this.props[`on${dialogType}`]();
                            }
                            }>
                            <NbText style={styles.btnOk}>确定</NbText>
                        </NbButton>
                    </View>
                    <View style={{ width: 125}}>
                        <NbButton  transparent onPress={
                                () => {
                                this.props.onSetModalVisible(false);
                                }
                            }>
                            <NbText style={styles.btnCancel}>取消</NbText>
                        </NbButton>
                    </View>
              </View>
              </View>
            </View>
          </Modal>
    );
  }
}