'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import NavigationBar from 'react-native-navbar';

export default class Events extends Component {
  render() {
    const { currentUser, onClose, onLogout } = this.props;
    const titleConfig = { title: 'Events', tintColor: 'white'  };
    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#faf8e0',
    flex: 1
  },
  header: {
    height: 60,
    backgroundColor: '#477dca'
  }
});
