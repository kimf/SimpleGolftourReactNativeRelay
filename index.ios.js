'use strict';

import React from "react";
import {AppRegistry} from "react-native";

import App from './src/App'

console.ignoredYellowBox = [
  'Warning: Failed propType: Invalid prop `date` of type `Number` supplied to `RCTDatePicker`',
  'Warning: Failed propType: Required prop `onDateChange` was not specified in `RCTDatePicker`',
  'Warning: Failed propType: Invalid prop `rightButton` supplied to `NavigationBar`',
  'Warning: Failed propType: Invalid prop `title` of type `object` supplied to `NavbarButton`',
  'Warning: Failed propType: SceneView: prop type `sceneRendererProps` is invalid'
];

AppRegistry.registerComponent('SimpleGolftour', () => App);
