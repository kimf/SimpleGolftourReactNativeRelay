'use strict';
import React, { Component } from "react";
import { AppState, View } from "react-native";
import { Provider } from 'react-redux';

import codePush from "react-native-code-push";
import { Scene, Router } from 'react-native-router-flux';
import moment from 'moment';
import Reactotron from 'reactotron';

import Routes from './routes';

import slowlog from 'react-native-slowlog';
// import {whyDidYouUpdate} from 'why-did-you-update'
// if(__DEV__) {
//   whyDidYouUpdate(React)
// }

//TODO: Move to Master.js, with eventListeners on AppState.
// import { loadLeaderboard, loadEvents } from './actions'

Reactotron.connect({enabled: __DEV__})
import configureStore from './configureStore';

export default class App extends Component {
  constructor(){
    super();
    slowlog(this, /.*/);

    this.state = {
      isLoading: true,
      store: configureStore(() => this.setState({isLoading: false}))
    }

    this.updateCodePush = this._updateCodePush.bind(this);
    this.handleAppStateChange = this._handleAppStateChange.bind(this);
  }


  componentDidMount() {
    this.updateCodePush();
    AppState.addEventListener('change', this.handleAppStateChange);
    // this.props.dispatch(loadLeaderboard());
    // this.props.dispatch(loadEvents());
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
    newState === "active" && this.updateCodePush();
    // this.props.dispatch(loadLeaderboard());
    // this.props.dispatch(loadEvents());
  }

  render() {
    if (this.state.isLoading) { return null; }

    return (
      <Provider store={store}>
        <Routes />
      </Provider>
    );
  }
}
