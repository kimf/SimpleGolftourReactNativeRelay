'use strict';
import React, { Component } from "react";
import { AppState, View, StatusBar } from "react-native";
import { Provider, connect } from 'react-redux';

import codePush from "react-native-code-push";
import moment from 'moment';

import slowlog from 'react-native-slowlog';

import Login from './containers/Login';
import SGTNavigator from './containers/SGTNavigator';

// import {whyDidYouUpdate} from 'why-did-you-update'
// if(__DEV__) {
//   whyDidYouUpdate(React)
// }
class App extends Component {
  constructor(){
    super();
    slowlog(this, /.*/);

    this.updateCodePush = this._updateCodePush.bind(this);
    this.handleAppStateChange = this._handleAppStateChange.bind(this);
  }


  componentDidMount() {
    this.updateCodePush();
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  _updateCodePush() {
    if(__DEV__) { return false; }

    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
      appendReleaseDescription: true
    });
  }

  _handleAppStateChange(newState) {
    if(newState === "active") {
      this.updateCodePush();
    }
  }

  render() {
    if (!this.props.isLoggedIn) {
      return <Login />;
    }

    return (
      <View style={{flex: 1, backgroundColor: '#fff', alignItems: 'stretch'}}>
        <StatusBar
          translucent={true}
          backgroundColor="rgba(0, 0, 0, 0.2)"
          barStyle="light-content"
         />
        <SGTNavigator />
      </View>
    )
  }
}


const select = (store) => {
  return {
    isLoggedIn: store.auth.user.session_token
  };
}

export default connect(select)(App)
