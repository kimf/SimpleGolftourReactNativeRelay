'use strict';
import React, {Component} from "react";
import { View, StatusBar, AppState } from "react-native";
import moment from 'moment';

import codePush from "react-native-code-push";

import Login from './components/Login';
import DataSyncer from './components/DataSyncer';
import SGTNavigator from './components/SGTNavigator'
import Events from './components/Events';


import AppRealm from '../lib/AppRealm';
import slowlog from 'react-native-slowlog';

import {whyDidYouUpdate} from 'why-did-you-update'
if(__DEV__) {
  whyDidYouUpdate(React, { exclude: /^YellowBox/ })
}

export default class App extends Component {
  constructor(props){
    super(props);
    slowlog(this, /.*/);
    this.currentUser = null;
    this.state = { component: null };
    this.onLogin = this.checkUserCreds.bind(this);
    this.syncIsDone = this.goDefault.bind(this);
    this.onLogout = this.onLogout.bind(this);
    this.updateCodePush = this.updateCodePush.bind(this);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
  }

  componentWillMount() {
    this.checkUserCreds();
    //this.clearAllData(true) //give true to clear userData as well
  }

  updateCodePush() {
    codePush.sync({
      updateDialog: true,
      installMode: codePush.InstallMode.IMMEDIATE,
      appendReleaseDescription: true
    });
  }

  componentDidMount() {
    if(!__DEV__) {
      this.updateCodePush();
      AppState.addEventListener('change', this._handleAppStateChange);
    }
  }

  componentWillUnmount() {
    if(!__DEV__) {
      AppState.removeEventListener('change', this._handleAppStateChange);
    }
  }

  _handleAppStateChange(newState) {
    if(!__DEV__) {
      newState === "active" && this.updateCodePush();
    }
  }

  goDefault() {
    this.setState({ component: 'Default' })
  }

  onLogout() {
    AppRealm.write(() => {
      this.currentUser.isLoggedIn = false;
      this.currentUser.sessionToken = '';
    })
    this.setState({ component: 'Login' });
  }

  checkUserCreds(synced = false) {
    this.currentUser = AppRealm.objects('CurrentUser')[0]

    if(this.currentUser && this.currentUser.sessionToken) {
      const syncedRecently = moment(parseInt(this.currentUser.syncedTimestamp)).isSame(Date.now(), 'day');
      if(syncedRecently) {
        this.setState({ component: 'Default' });
      } else {
        let clubs = AppRealm.objects('Club');
        let events = AppRealm.objects('Event');
        let players = AppRealm.objects('Player');
        if(clubs.length === 0 || events.length === 0 || players.length === 0) {
          this.setState({ component: 'DataSyncer', needClubs: (clubs.length === 0) });
        } else {
          this.setState({ component: 'Default' });
        }
      }
    } else {
      this.setState({ component: 'Login' });
    }
  }

  render() {
    const { component, needClubs } = this.state;

    if(component === 'DataSyncer') {
      return (
        <DataSyncer onDone={this.syncIsDone} needClubs={needClubs} currentUser={this.currentUser}/>
      );
    } else if(component === 'Default') {
      return (
        <View style={{ backgroundColor: '#fff', alignItems: 'stretch', flex: 1 }}>
          <StatusBar
            translucent={true}
            backgroundColor="#477dca"
            barStyle="light-content"
           />
          <SGTNavigator currentUser={this.currentUser} onLogout={this.onLogout}/>
        </View>
      );
    } else if(component === 'Login') {
      return <Login onLogin={this.onLogin} currentUser={this.currentUser} />;
    } else {
      return null;
    }
  }

  // ------------------------------------------------------------------------------
  // TMP - FOR CLEARING THINGS UP
  clearAllData(userDataTo = false){
    const eventPlayers = AppRealm.objects('EventPlayer');
    const eventScores = AppRealm.objects('EventScore');
    const eventTeams = AppRealm.objects('EventTeam');
    const events = AppRealm.objects('Event');
    const players = AppRealm.objects('Player');
    const currentUser = AppRealm.objects('CurrentUser')[0]

    // const clubs = AppRealm.objects('Club');
    // const courses = AppRealm.objects('Course');
    // const holes = AppRealm.objects('Hole');

    AppRealm.write(() => {
      // AppRealm.delete(clubs);
      // AppRealm.delete(courses);
      // AppRealm.delete(holes);
      AppRealm.delete(eventPlayers);
      AppRealm.delete(eventScores);
      AppRealm.delete(eventTeams);
      AppRealm.delete(events);
      AppRealm.delete(players);
      currentUser.syncedTimestamp = null;
      if(userDataTo) {
        currentUser.isLoggedIn = false;
        currentUser.sessionToken = '';
      }
    });
  }
}
