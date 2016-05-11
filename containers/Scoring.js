'use strict';

import React, {Component} from "react";
import {NavigationExperimental, Text, View} from "react-native";;

import EventSetup from '../components/Scoring/EventSetup';
import EventPlayerSetup from '../components/Scoring/EventPlayerSetup';
import ScoreEvent from '../components/Scoring/ScoreEvent';
import ChoosePlayer from '../components/Scoring/ChoosePlayer';

import realm from '../realm'
import ScoringReducer from '../lib/ScoringReducer';

export default class Scoring extends Component {
  constructor(props) {
    super(props);
    this.state = ScoringReducer();
  }

  dispatch(action) {
    this.setState(ScoringReducer(this.state, action));
  }

  render() {
    const { event, sessionToken, currentUserId, appDispatch } = this.props;
    const scene = this.state.scenes[this.state.scenes.length - 1];

    if(scene.key === 'firstRun') {
      scene.type = event.isScoring ? 'scoreEvent' : 'selectPlayers';
    }

    if (scene.type === 'selectPlayers') {
      return (
        <EventSetup
          id={scene.key}
          event={event}
          appDispatch={appDispatch}
          dispatch={this.dispatch.bind(this)}
          currentUserId={currentUserId}
        />
      );
    }

    if (scene.type === 'setupEventPlayer') {
      return (
        <EventPlayerSetup
          event={event}
          player={scene.player}
          dispatch={this.dispatch.bind(this)}
          needsSaving={scene.needsSaving}
        />
      );
    }

    if (scene.type === 'choosePlayer') {
      return (
        <ChoosePlayer
          event={event}
          dispatch={this.dispatch.bind(this)}
        />
      );
    }

    if (scene.type === 'scoreEvent') {
      return (
        <ScoreEvent
          id={scene.key}
          event={event}
          sessionToken={sessionToken}
          appDispatch={appDispatch}
          dispatch={this.dispatch.bind(this)}
        />
      );
    }

    return null;
  }
}
