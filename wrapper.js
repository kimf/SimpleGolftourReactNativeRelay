'use strict';
import React, {Component} from "react";
import {AsyncStorage} from "react-native";
import moment from 'moment';

import Default from './containers/Default';
import Login from './containers/Login';
import DataSyncer from './components/DataSyncer';

import Events from './components/Default/Events';

import realm from './realm';

export default class Wrapper extends Component {
  constructor(props){
    super(props);
    this.userData = false;
    this.state = { component: null };
    this.onLogin = this.checkUserCreds.bind(this);
    this.syncIsDone = this.goDefault.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  componentWillMount() {
    this.checkUserCreds();
    //this.clearAllData() //give true to clear userData as well
  }

  clearAllData(userDataTo){
    // ------------------------------------------------------------------------------
    // TMP - FOR CLEARING THINGS UP
    const eventPlayers = realm.objects('EventPlayer');
    const eventScores = realm.objects('EventScore');
    const eventTeams = realm.objects('EventTeam');
    const events = realm.objects('Event');
    const players = realm.objects('Player');
    realm.write(() => {
      realm.delete(eventPlayers);
      realm.delete(eventScores);
      realm.delete(eventTeams);
      realm.delete(events);
      realm.delete(players);
    });
    AsyncStorage.removeItem('syncedTimestamp');
    if(userDataTo) {
      AsyncStorage.removeItem('userData');
    }
  }

  goDefault() {
    this.setState({ component: 'Default', userData: this.userData })
  }

  onLogout() {
    AsyncStorage.getItem('userData', (err, result) => {
      const oldData = JSON.parse(result);
      this.userData  = { email: oldData.email };
      AsyncStorage.setItem('userData', JSON.stringify(this.userData));
      this.setState({ component: 'Login' });
    });
  }

  checkUserCreds(synced = false) {
    //AsyncStorage.removeItem('userData');
    AsyncStorage.getItem('userData', (err, result) => {
      let newData = JSON.parse(result);
      if(newData && newData.isLoggedIn && newData.session_token) {
        this.userData = newData;

        AsyncStorage.getItem('syncedTimestamp', (err, result) => {
          const syncedRecently = moment(parseInt(result)).isSame(Date.now(), 'day');
          if(syncedRecently) {
            this.setState({ component: 'Default' });
          } else {
            let clubs = realm.objects('Club');
            let events = realm.objects('Event');
            let players = realm.objects('Player');
            if(clubs.length === 0 || events.length === 0 || players.length === 0) {
              this.setState({ component: 'DataSyncer', needClubs: (clubs.length === 0) });
            } else {
              this.setState({ component: 'Default' });
            }
          }
        });
      } else {
        this.setState({ component: 'Login' });
      }
    });
  }

  render() {
    const { component, needClubs } = this.state;

    if(component === 'DataSyncer') {
      return (
        <DataSyncer onDone={this.syncIsDone} needClubs={needClubs} sessionToken={this.userData.session_token}/>
      );
    } else if(component === 'Default') {
      return (
        <Default
          onLogout={this.onLogout}
          currentUser={this.userData}
        />
      );
    } else if(component === 'Login') {
      return <Login onLogin={this.onLogin} userData={this.userData} />;
    } else {
      return null;
    }
  }
}
