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
    const { currentUser, onLogout } = this.props;
    const titleConfig = { title: currentUser.name, tintColor: 'white'  };
    const leftButtonConfig = {
      title: 'Close',
      handler: () => this.props.navigator.pop(),
      tintColor: 'white'
    };
    return(
      <Modal visible={this.props.visible} animated>
        <View style={styles.container}>
          <NavigationBar
            style={styles.header}
            title={titleConfig}
            statusBar={{style: 'light-content', tintColor: '#477dca'}}
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
    borderRadius: 5,
    marginTop: 200,
    padding: 10,
    marginLeft: 20,
    marginRight: 20
  },
  btnLabel: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    paddingLeft: 40,
    paddingRight: 40,
  },
  header: {
    height: 60,
    backgroundColor: '#477dca'
  }
});
