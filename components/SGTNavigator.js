'use strict';

import React, { Component } from 'react';
import { Navigator } from 'react-native';

import SGTTabsView from './SGTTabsView';
import NewEvent from '../components/NewEvent/NewEvent';
import SetCourse from '../components/NewEvent/SetCourse';

import EventSetup from '../components/Scoring/EventSetup';
import ChoosePlayer from '../components/Scoring/ChoosePlayer';
import EventPlayerSetup from '../components/Scoring/EventPlayerSetup';
import ScoreEvent from '../components/Scoring/ScoreEvent';
import Scorecard from '../components/Scoring/Scorecard';

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
        style={{flex: 1, alignItems: 'stretch', backgroundColor: '#feb'}}
        configureScene={(route) => {
          if (route.newEvent || route.selectPlayer || route.setupEventPlayer || route.showScorecard) {
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

    if (route.showScorecard) {
      return <Scorecard
                event={route.event}
                navigator={navigator} />
    }

    if (route.scoreEvent) {
      return <ScoreEvent
                event={route.event}
                sessionToken={currentUser.sessionToken}
                navigator={navigator} />
    }

    if (route.setupEventPlayer) {
      return <EventPlayerSetup
                event={route.event}
                player={route.player}
                navigator={navigator}
                needsSaving={route.needsSaving} />
    }

    if (route.selectPlayer) {
      return <ChoosePlayer
                event={route.event}
                navigator={navigator} />
    }

    if (route.setupEvent) {
      return <EventSetup
                event={route.event}
                navigator={navigator}
                currentUserId={currentUser.id} />
    }

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
