'use strict';
import React, {Component} from "react";
import { View, StatusBar } from "react-native";
import moment from 'moment';

import Login from './components/Login';
import DataSyncer from './components/DataSyncer';
import SGTNavigator from './components/SGTNavigator'
import Events from './components/Events';

import realm from './realm';

//import {whyDidYouUpdate} from 'why-did-you-update'
//if(__DEV__) { whyDidYouUpdate(React) }

export default class Wrapper extends Component {
  constructor(props){
    super(props);
    this.currentUser = null;
    this.state = { component: null };
    this.onLogin = this.checkUserCreds.bind(this);
    this.syncIsDone = this.goDefault.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  componentWillMount() {
    this.checkUserCreds();
    //this.clearAllData(true) //give true to clear userData as well
  }

  // ------------------------------------------------------------------------------
  // TMP - FOR CLEARING THINGS UP
  clearAllData(userDataTo = false){
    const eventPlayers = realm.objects('EventPlayer');
    const eventScores = realm.objects('EventScore');
    const eventTeams = realm.objects('EventTeam');
    const events = realm.objects('Event');
    const players = realm.objects('Player');
    const currentUser = realm.objects('CurrentUser')[0]

    // const clubs = realm.objects('Club');
    // const courses = realm.objects('Course');
    // const holes = realm.objects('Hole');

    realm.write(() => {
      // realm.delete(clubs);
      // realm.delete(courses);
      // realm.delete(holes);
      realm.delete(eventPlayers);
      realm.delete(eventScores);
      realm.delete(eventTeams);
      realm.delete(events);
      realm.delete(players);
      currentUser.syncedTimestamp = null;
      if(userDataTo) {
        currentUser.isLoggedIn = false;
        currentUser.sessionToken = '';
      }
    });
  }

  goDefault() {
    this.setState({ component: 'Default' })
  }

  onLogout() {
    realm.write(() => {
      this.currentUser.isLoggedIn = false;
      this.currentUser.sessionToken = '';
    })
    this.setState({ component: 'Login' });
  }

  checkUserCreds(synced = false) {
    this.currentUser = realm.objects('CurrentUser')[0]

    if(this.currentUser && this.currentUser.isLoggedIn && this.currentUser.sessionToken) {
      const syncedRecently = moment(parseInt(this.currentUser.syncedTimestamp)).isSame(Date.now(), 'day');
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
}
