import React, { Component, PropTypes } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';

export default class Master extends Component {

  render () {
    return (
      <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'stretch'}}>
        <View>
          <Text>
            MASTER
          </Text>
        </View>
      </View>
    );
  }
}
