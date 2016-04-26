const devBuild = process.env.NODE_ENV !== 'production'

import React, { AsyncStorage } from 'react-native';
const apiUrl = devBuild ? 'http://home.fransman.se:8123' : 'http://home.fransman.se:8123'

const exports = module.exports = {};

exports.apiUrl = apiUrl;
