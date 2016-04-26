'use strict';

import Relay from 'react-relay';

import React, {
  Component,
  NavigationExperimental,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Leaderboard from './Leaderboard';
import Profile from './Profile';
import Events from './Events';
import AppReducer from '../lib/AppReducer';

class CurrentUser extends Component {
  constructor(props) {
    super(props);
    this.state = AppReducer(null, { type: 'init' });
  }

  dispatch(action) {
    this.setState(AppReducer(this.state, action));
  }

  render() {
    const { currentUser, onLogout } = this.props;
    const scene = this.state.scenes[this.state.scenes.length - 1];

    if (scene.key === 'leaderboard') {
      return (
        <Leaderboard currentUser={currentUser} dispatch={this.dispatch.bind(this)} />
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

    return null;
  }
}

export default Relay.createContainer(CurrentUser, {
  fragments: {
    currentUser: () => Relay.QL`
      fragment on User {
        id,
        name,
        email
      }
    `
  }
});


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#faf8e0',
    flex: 1
  }
});


