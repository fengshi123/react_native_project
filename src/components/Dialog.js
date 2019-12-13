import React, { Component } from 'react';
import { 
  View, 
  Modal,
  Text,
  TouchableOpacity, 
} from 'react-native';
import styles from '../assets/styles/components/dialog';
import PropTypes from 'prop-types';

export default class Dialog extends Component {

  constructor(props) {
    super(props);
  }
  render() {
    const modalVisible = this.props.modalVisible;
    const handleSure = this.props.handleSure;
    const handleCancel = this.props.handleCancel;
    return (
      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
        >
        <View style={styles.modal}>
          <View style={styles.modalContent}>
            {this.props.children}
            <View footer style={styles.footer}>
            {
              this.props.cancel &&
              <TouchableOpacity
                  onPress={handleCancel}
              >
                <Text style={styles.btn}>取消</Text>
              </TouchableOpacity>
            }
              <TouchableOpacity
                  onPress={handleSure}
              >
                <Text style={styles.btn}>确定</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

Dialog.defaultProps = {
  cancel: true
};
Dialog.propTypes = {
  cancel: PropTypes.bool
};

