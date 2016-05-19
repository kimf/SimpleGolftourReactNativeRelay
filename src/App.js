'use strict';
import React, { Component } from "react";
import { AppState, View, StatusBar } from "react-native";

import codePush from "react-native-code-push";
import { Scene, Router } from 'react-native-router-flux';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import { connect } from 'react-redux';

const RouterWithRedux = connect()(Router);
import reducers from './reducers';

import moment from 'moment';

import Master from './containers/Master';
import Login from './containers/Login';

import slowlog from 'react-native-slowlog';
// import {whyDidYouUpdate} from 'why-did-you-update'
// if(__DEV__) {
//   whyDidYouUpdate(React)
// }

// create store...
const middleware = [/* ...your middleware (i.e. thunk) */];
const store = compose(
  applyMiddleware(...middleware)
)(createStore)(reducers);


export default class App extends Component {
  constructor(props){
    super(props);
    slowlog(this, /.*/);
    this.state = Object.assign({}, { user: false });

    this.updateCodePush = this._updateCodePush.bind(this);
    this.handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  componentDidMount() {
    if(!__DEV__) {
      this.updateCodePush();
      AppState.addEventListener('change', this.handleAppStateChange);
    }
  }

  componentWillUnmount() {
    if(!__DEV__) {
      AppState.removeEventListener('change', this.handleAppStateChange);
    }
  }

  _updateCodePush() {
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
      appendReleaseDescription: true
    });
  }

  _handleAppStateChange(newState) {
    if(!__DEV__) {
      newState === "active" && this.updateCodePush();
    }
  }


  // _renderContent() {
  //   //get routeStack ??
  //   if(this.state.user.isLoggedIn()) {
  //     return <Master ref="current" />;
  //   } else {
  //     return <Login ref="current" />;
  //   }
  // }

  render() {
    //if(!this.state.user) { return null; }

    return (
      <View style={{ alignItems: 'stretch', backgroundColor: '#eee', flex: 1 }}>
        <StatusBar translucent={true} barStyle="light-content" />
        <Provider store={store}>
          <RouterWithRedux>
            <Scene key="root">
              <Scene key="login" component={Login} title="Login" />
              <Scene key="master" component={Master} title="Tisdagsgolfen" />
            </Scene>
          </RouterWithRedux>
        </Provider>
      </View>
    );
  }
}
