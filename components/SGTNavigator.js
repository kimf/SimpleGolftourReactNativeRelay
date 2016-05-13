'use strict';

import React, { Component } from 'react';
import { Navigator } from 'react-native';

import SGTTabsView from './SGTTabsView';
import NewEvent from '../components/NewEvent/NewEvent';
import SetCourse from '../components/NewEvent/SetCourse';

function TabReducer(lastState, action) {
  let state = lastState;

  if (!state) {
    return { tab: 'leaderboard' }
  }

  if (action.type === 'changeTab') {
    return { tab: action.tab }
  }
}


export default class SGTNavigator extends Component {
  constructor(props) {
    super(props);
    this.state = TabReducer();
    this.changeTab = this.changeTab.bind(this);
    this.renderScene = this.renderScene.bind(this);
  }

  changeTab(action) {
    this.setState(TabReducer(this.state, action));
  }

  render() {
    return (
      <Navigator
        ref="navigator"
        style={{flex: 1, backgroundColor: 'black'}}
        configureScene={(route) => {
          if (route.setupEvent || route.newEvent) {
             return Navigator.SceneConfigs.FloatFromRight;
           } else {
             return Navigator.SceneConfigs.FloatFromBottom;
           }
        }}
        initialRoute={{}}
        renderScene={this.renderScene}
      />
    );
  }

  renderScene(route, navigator) {
    const { currentUser, onLogout } = this.props;

    console.log(route);

    if (route.setCourse) {
      return <SetCourse navigator={navigator} />;
    }

    if (route.newEvent) {
      return <NewEvent
                sessionToken={currentUser.sessionToken}
                navigator={navigator}
                course={route.course} />;
    }

    return <SGTTabsView
              navigator={navigator}
              tab={this.state.tab}
              currentUser={currentUser}
              onLogout={onLogout}
              changeTab={this.changeTab} />;
  }
}
