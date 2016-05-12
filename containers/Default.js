'use strict';

import React, {Component} from "react";
import {NavigationExperimental, Text, View} from "react-native";;
import moment from 'moment';

import realm from '../realm'

import Leaderboard from '../components/Default/Leaderboard';
import Profile from '../components/Default/Profile';
import Events from '../components/Default/Events';
import NewEvent from '../containers/NewEvent';
import Scoring from '../containers/Scoring';

import AppReducer from '../lib/AppReducer';

export default class Default extends Component {
  constructor(props) {
    super(props);
    this.state = AppReducer();
  }

  dispatch(action) {
    this.setState(AppReducer(this.state, action));
  }

  render() {
    const { currentUser, onLogout } = this.props;
    const scene = this.state.scenes[this.state.scenes.length - 1];

    if (scene.key === 'leaderboard') {
      const scoringEvent = realm.objects('Event').find(event => event.isScoring);
      return (
        <Leaderboard
          id={scene.key}
          scoringEvent={scoringEvent}
          sessionToken={currentUser.session_token}
          dispatch={this.dispatch.bind(this)}
        />
      );
    }
    if (scene.type === 'profile') {
      return (
        <Profile
          currentUser={currentUser}
          id={scene.key}
          dispatch={this.dispatch.bind(this)}
          onLogout={onLogout}
        />
      );
    }

    if (scene.type === 'events') {
      return (
        <Events
          id={scene.key}
          sessionToken={currentUser.session_token}
          dispatch={this.dispatch.bind(this)}
        />
      );
    }

    if (scene.type === 'newEvent') {
      return (
        <NewEvent
          id={scene.key}
          sessionToken={currentUser.session_token}
          appDispatch={this.dispatch.bind(this)}
        />
      );
    }

    if (scene.type === 'setupEvent') {
      return (
        <Scoring
          id={scene.key}
          event={scene.event}
          sessionToken={currentUser.session_token}
          currentUserId={currentUser.id}
          appDispatch={this.dispatch.bind(this)}
        />
      );
    }

    return null;
  }
}
