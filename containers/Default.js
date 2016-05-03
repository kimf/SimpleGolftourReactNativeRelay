'use strict';

import React, {
  AsyncStorage,
  Component,
  NavigationExperimental,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Leaderboard from '../components/Leaderboard';
import Profile from '../components/Profile';
import Event from '../components/Event';
import Events from '../components/Events';
import ScoreEvent from '../components/ScoreEvent';
import NewEvent from '../components/NewEvent';
import Loading from '../components/Loading';

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
          events={currentUser.current_season_events}
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

    if (scene.type === 'showEvent') {
      return (
        <Event
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
          dispatch={this.dispatch.bind(this)}
        />
      );
    }

    return null;
  }
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#faf8e0',
    flex: 1
  }
});


