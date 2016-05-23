'use strict';

import React from "react";
import {AppRegistry} from "react-native";

Raven = require('raven-js');
require('raven-js/plugins/react-native')(Raven);
Raven
  .config('https://<key>@app.getsentry.com/<project>', { release: '1.0-beta2' })
  .install();

import Reactotron from 'reactotron';
Reactotron.connect({enabled: __DEV__})

import Root from './src/Root'

console.ignoredYellowBox = [
  'Warning: Failed propType: Invalid prop `date` of type `Number` supplied to `RCTDatePicker`',
  'Warning: Failed propType: Required prop `onDateChange` was not specified in `RCTDatePicker`',
  'Warning: Failed propType: Invalid prop `rightButton` supplied to `NavigationBar`',
  'Warning: Failed propType: Invalid prop `title` of type `object` supplied to `NavbarButton`',
  'Warning: Failed propType: SceneView: prop type `sceneRendererProps` is invalid'
];

AppRegistry.registerComponent('SimpleGolftour', () => Root);
