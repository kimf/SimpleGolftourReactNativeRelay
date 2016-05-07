'use strict';

import React, {
  AsyncStorage,
  Component,
  NavigationExperimental,
  Text,
  View,
} from 'react-native';

import Leaderboard from '../components/Leaderboard';
import Profile from '../components/Profile';
import Events from '../components/Events';
import SelectPlayers from '../components/SelectPlayers';
import NewEvent from '../components/NewEvent';
import Loading from '../components/Loading';
import ScoreEvent from '../components/ScoreEvent';
import SetHcp from '../components/SetHcp';

import AppReducer from '../lib/AppReducer';

export default class Default extends Component {
  constructor(props) {
    super(props);
    this.state = AppReducer(props.currentNavState, { type: 'rehydrate' });
  }

  dispatch(action) {
    this.setState(AppReducer(this.state, action));
  }

  render() {
    const { currentUser, onLogout } = this.props;
    const scene = this.state.scenes[this.state.scenes.length - 1];

    if (scene.key === 'leaderboard') {
      return (
        <Leaderboard
          currentUser={currentUser}
          id={scene.key}
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
          currentUser={currentUser}
          id={scene.key}
          dispatch={this.dispatch.bind(this)}
        />
      );
    }

    if (scene.type === 'newEvent') {
      return (
        <NewEvent
          currentUser={currentUser}
          id={scene.key}
          dispatch={this.dispatch.bind(this)}
        />
      );
    }

    if (scene.type === 'selectPlayers') {
      return (
        <SelectPlayers
          currentUser={currentUser}
          id={scene.key}
          event={scene.event}
          dispatch={this.dispatch.bind(this)}
        />
      );
    }

    if (scene.type === 'scoreEvent') {
      return (
        <ScoreEvent
          currentUser={currentUser}
          id={scene.key}
          event={scene.event}
          players={scene.players}
          dispatch={this.dispatch.bind(this)}
        />
      );
    }

    return null;
  }
}
