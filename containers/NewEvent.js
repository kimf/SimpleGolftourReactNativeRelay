'use strict';

import React, {Component} from "react";
import {NavigationExperimental, Text, View} from "react-native";;
import moment from 'moment';

import realm from '../realm'

import NewEvent from '../components/NewEvent/NewEvent';
import SetCourse from '../components/NewEvent/SetCourse';

import NewEventReducer from '../lib/NewEventReducer';

export default class Default extends Component {
  constructor(props) {
    super(props);
    this.state = NewEventReducer();
  }

  dispatch(action) {
    this.setState(NewEventReducer(this.state, action));
  }

  render() {
    const { sessionToken, onLogout, appDispatch } = this.props;
    const scene = this.state.scenes[this.state.scenes.length - 1];

    if (scene.type === 'newEvent') {
      return (
        <NewEvent
          sessionToken={sessionToken}
          id={scene.key}
          course={scene.course}
          appDispatch={appDispatch}
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
