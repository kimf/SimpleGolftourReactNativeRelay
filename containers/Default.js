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
import SetCourse from '../components/SetCourse';

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
      return (
        <Leaderboard
          id={scene.key}
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
          sessionToken={currentUser.session_token}
          id={scene.key}
          course={scene.course}
          dispatch={this.dispatch.bind(this)}
        />
      );
    }

    if (scene.type === 'selectPlayers') {
      return (
        <SelectPlayers
          id={scene.key}
          event={scene.event}
          dispatch={this.dispatch.bind(this)}
        />
      );
    }

    if (scene.type === 'scoreEvent') {
      return (
        <ScoreEvent
          id={`${scene.key}-${scene.event.id}-${scene.event.currentHole}`}
          event={scene.event}
          dispatch={this.dispatch.bind(this)}
        />
      );
    }

    if (scene.type === 'selectCourse') {
      return (
        <SetCourse
          id={scene.key}
          dispatch={this.dispatch.bind(this)}
        />
      );
    }

    return null;
  }
}
