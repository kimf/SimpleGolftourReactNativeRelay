import React, {Component} from "react";
import {Dimensions, View, StatusBar, Image} from "react-native";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Loading extends Component {
  render() {
    return(
      <View style={{
        flexDirection: 'column',
        paddingTop: 250,
        backgroundColor: '#477dca',
        alignItems: 'center',
        width: width,
        height: height
      }}>
        <StatusBar barStyle="light-content" />
        <Image source={require('../../images/logo.png')} />
      </View>
    )
  }
}
