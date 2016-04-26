'use strict';

import Reactotron from 'reactotron';
Reactotron.connect({enabled: __DEV__})

import React, { AppRegistry } from 'react-native';

import SimpleGolftour from './SimpleGolftour'

// console.ignoredYellowBox = [
//   // FIXME: https://github.com/facebook/react-native/issues/1501
//   'Warning: ScrollView doesn\'t take rejection well - scrolls anyway',
// ];

AppRegistry.registerComponent('SimpleGolftour', () => SimpleGolftour);
