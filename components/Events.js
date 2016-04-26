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
    const titleConfig = { title: 'Events' };
    const { currentUser } = this.props;
    return(
      <View style={styles.container}>
        <NavigationBar title={titleConfig} />
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
    alignSelf: 'center',
    color: '#00b3cc',
    fontFamily: 'Helvetica Neue',
    fontSize: 80,
    fontWeight: '100',
  },
});
