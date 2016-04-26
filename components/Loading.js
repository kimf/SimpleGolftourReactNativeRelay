import React, { Component, View, StyleSheet, Text } from 'react-native';

export default class Loading extends Component {
  render() {
    return(
      <View style={styles.container}>
        <Text style={styles.header}>Loading...</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#faf8e0',
    flex: 1,
    paddingTop: 100,
  },
  header: {
    alignSelf: 'center',
    color: '#00b3cc',
    fontFamily: 'Helvetica Neue',
    fontSize: 80,
    fontWeight: '100',
  },
});
