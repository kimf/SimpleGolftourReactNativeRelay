'use strict';

import React, { Component } from 'react';
import { Navigator } from 'react-native';

import SGTTabsView from '../components/SGTTabsView';
import NewEvent from '../components/NewEvent/NewEvent';
import SetCourse from '../components/NewEvent/SetCourse';

import EventSetup from '../components/Scoring/EventSetup';
import ChoosePlayer from '../components/Scoring/ChoosePlayer';
import EventPlayerSetup from '../components/Scoring/EventPlayerSetup';
import ScoreEvent from '../components/Scoring/ScoreEvent';
import Scorecard from '../components/Scoring/Scorecard';

import { connect } from 'react-redux';
import { changeTab } from '../actions';


class SGTNavigator extends Component {
  constructor(props) {
    super(props);
    this.renderScene = this.renderScene.bind(this);
  }

  render() {
    console.log(this.props);
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

    console.log(route);

    // if (route.showScorecard || route.followEvent) {
    //   return <Scorecard
    //             event={route.event}
    //             sessionToken={currentUser.sessionToken}
    //             navigator={navigator} />
    // }

    // if (route.scoreEvent) {
    //   return <ScoreEvent
    //             event={route.event}
    //             sessionToken={currentUser.sessionToken}
    //             navigator={navigator} />
    // }

    // if (route.setupEventPlayer) {
    //   return <EventPlayerSetup
    //             event={route.event}
    //             player={route.player}
    //             navigator={navigator}
    //             needsSaving={route.needsSaving} />
    // }

    // if (route.selectPlayer) {
    //   return <ChoosePlayer
    //             event={route.event}
    //             navigator={navigator} />
    // }

    // if (route.setupEvent) {
    //   return <EventSetup
    //             event={route.event}
    //             navigator={navigator}
    //             currentUserId={currentUser.id} />
    // }

    // if (route.setCourse) {
    //   return <SetCourse navigator={navigator} />;
    // }

    // if (route.newEvent) {
    //   return <NewEvent
    //             sessionToken={currentUser.sessionToken}
    //             navigator={navigator}
    //             course={route.course} />;
    // }

    return <SGTTabsView navigator={navigator} tab={tab} changeTab={changeTab} />;
  }
}


const select = (store) => {
  return {
    tab: store.tabs.tab
  };
}

export default connect(select)(SGTNavigator);
