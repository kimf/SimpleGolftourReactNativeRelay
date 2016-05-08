'use strict';

import React from "react";
import {AppRegistry} from "react-native";

import wrapper from './wrapper'

// console.ignoredYellowBox = [
//   // FIXME: https://github.com/facebook/react-native/issues/1501
//   'Warning: ScrollView doesn\'t take rejection well - scrolls anyway',
// ];

AppRegistry.registerComponent('SimpleGolftour', () => wrapper);
