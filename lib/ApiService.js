const apiUrl = __DEV__
               ? 'http://simplegolftour.local:8123/api'
               : 'http://home.fransman.se:8123/api';

const exports = module.exports = {
  apiUrl: apiUrl,
  courseApiUrl: 'http://golfstats.fransman.se/tisdagsgolfendata'
};
