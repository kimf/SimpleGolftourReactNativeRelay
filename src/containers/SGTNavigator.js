'use strict';

import React, { Component } from 'react';
import { Navigator } from 'react-native';

import SGTTabsView from './SGTTabsView';

import SetCourse from '../components/NewEvent/SetCourse';

import NewEvent from '../containers/NewEvent';
import EventSetup from '../containers/EventSetup';
import ChoosePlayer from '../containers/ChoosePlayer';
import EventPlayerSetup from '../containers/EventPlayerSetup';
import ScoreEvent from '../containers/ScoreEvent';
import Scorecard from '../containers/Scorecard';
import FollowEvent from '../containers/FollowEvent';

import { connect } from 'react-redux';

class SGTNavigator extends Component {
  constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
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
    const { currentUser, tab, onLogoutClick } = this.props;

    if (route.followEvent) {
      return <FollowEvent navigator={navigator} event={route.event} />
    }

    if (route.showScorecard) {
      return <Scorecard navigator={navigator} />
    }

    if (route.scoreEvent) {
      console.log(route.event);
      return <ScoreEvent navigator={navigator} event={route.event} />
    }

    if (route.setupEventPlayer) {
      return <EventPlayerSetup event={route.event} player={route.player} navigator={navigator} />
    }

    if (route.selectPlayer) {
      return <ChoosePlayer event={route.event} navigator={navigator} />
    }

    if (route.setupEvent) {
      return <EventSetup event={route.event} navigator={navigator} />
    }

    if (route.setCourse) {
      return <SetCourse navigator={navigator} />;
    }

    if (route.newEvent) {
      return <NewEvent navigator={navigator} course={route.course} />;
    }

    return <SGTTabsView navigator={navigator} />;
  }
}


const select = (store) => {
  return {
    tab: store.tabs.tab
  };
}

export default connect(select)(SGTNavigator);
