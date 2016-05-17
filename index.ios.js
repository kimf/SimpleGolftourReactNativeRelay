'use strict';

import React from "react";
import {AppRegistry} from "react-native";

import wrapper from './wrapper'

console.ignoredYellowBox = [
  'Warning: Failed propType: Invalid prop `date` of type `Number` supplied to `RCTDatePicker`',
  'Warning: Failed propType: Required prop `onDateChange` was not specified in `RCTDatePicker`',
  'Warning: Failed propType: Invalid prop `rightButton` supplied to `NavigationBar`',
  'Warning: Failed propType: Invalid prop `title` of type `object` supplied to `NavbarButton`'
];

AppRegistry.registerComponent('SimpleGolftour', () => wrapper);
