'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
} from 'react-native';

import NavigationBar from 'react-native-navbar';

export default class Profile extends Component {
  render() {
    const { currentUser, onClose, onLogout } = this.props;
    const titleConfig = { title: currentUser.name };
    const leftButtonConfig = {
      title: 'Close',
      handler: onClose
    };
    return(
      <Modal visible={this.props.visible} animated>
        <View style={styles.container}>
          <NavigationBar
            title={titleConfig}
            leftButton={leftButtonConfig} />

            <TouchableOpacity onPress={onLogout} style={styles.btn}>
              <Text style={styles.btnLabel}> LOGGA UT </Text>
            </TouchableOpacity>
        </View>
      </Modal>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#faf8e0',
    flex: 1
  },
  btn: {
    backgroundColor: 'black',
    borderRadius: 25,
    marginTop: 200,
    padding: 10,
  },
  btnLabel: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    paddingLeft: 40,
    paddingRight: 40,
  }
});
