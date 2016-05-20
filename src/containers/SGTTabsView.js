'use strict';

import React, { Component } from 'react';
import { StatusBar, TabBarIOS, Navigator } from 'react-native';

import { TabBarItemIOS } from 'react-native-vector-icons/FontAwesome';

import SGTColors from '../colors';

import Events from '../containers/Events';
import Leaderboard from '../containers/Leaderboard';

import { connect } from 'react-redux';
import { changeTab } from '../actions';

class SGTTabsView extends Component {
  onTabSelect(tab) {
    if (this.props.tab !== tab) {
      this.props.onTabSelect(tab);
    }
  }

  render() {
    const { navigator, notificationsBadge, tab } = this.props;
    return (
      <TabBarIOS tintColor={SGTColors.darkText}>
        <TabBarItemIOS
          title="Ledartavla"
          selected={tab === 'leaderboard'}
          onPress={() => this.onTabSelect('leaderboard')}
          iconSize={20}
          iconName="list-ol">
          <Leaderboard navigator={navigator} />
        </TabBarItemIOS>
        <TabBarItemIOS
          title="Rundor"
          selected={tab === 'events'}
          onPress={() => this.onTabSelect('events')}
          iconSize={20}
          iconName="calendar">
          <Events navigator={navigator} />
        </TabBarItemIOS>
      </TabBarIOS>
    );
  }
}


const select = (store) => {
  return {
    tab: store.tabs.tab
  };
}

const actions = (dispatch) => {
  return {
    onTabSelect: (tab) => dispatch(changeTab(tab)),
  };
}


export default connect(select, actions)(SGTTabsView);
