'use strict';

import React, { Component } from 'react';
import { StatusBar, TabBarIOS, Navigator } from 'react-native';

import { TabBarItemIOS } from 'react-native-vector-icons/FontAwesome';

import SGTColors from '../common/colors';

import Events from '../components/Events';
import Leaderboard from '../components/Leaderboard';
import Profile from '../components/Profile';

export default class SGTTabsView extends Component {
  constructor(props) {
    super(props);
    this.onTabSelect = this.onTabSelect.bind(this);
  }

  componentDidMount() {
    StatusBar.setBarStyle('light-content');
  }

  onTabSelect(tab) {
    if (this.props.tab !== tab) {
      this.props.changeTab({type: 'changeTab', tab});
    }
  }

  render() {
    const { currentUser, navigator, notificationsBadge, onLogout, tab } = this.props;
    return (
      <TabBarIOS tintColor={SGTColors.darkText}>
        <TabBarItemIOS
          title="Ledartavla"
          selected={tab === 'leaderboard'}
          onPress={() => this.onTabSelect('leaderboard')}
          iconSize={20}
          iconName="list-ol">
          <Leaderboard sessionToken={currentUser.sessionToken} />
        </TabBarItemIOS>
        <TabBarItemIOS
          title="Rundor"
          selected={tab === 'events'}
          onPress={() => this.onTabSelect('events')}
          iconSize={20}
          iconName="calendar">
          <Events
            sessionToken={currentUser.sessionToken}
            navigator={navigator}
          />
        </TabBarItemIOS>
        <TabBarItemIOS
          title="Profil"
          selected={tab === 'settings'}
          onPress={() => this.onTabSelect('settings')}
          badge={notificationsBadge || null}
          iconSize={20}
          iconName="user">
          <Profile
            currentUser={currentUser}
            onLogout={onLogout}
          />
        </TabBarItemIOS>
      </TabBarIOS>
    );
  }
}
