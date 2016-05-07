const devBuild = process.env.NODE_ENV !== 'production'

//const apiUrl = devBuild ? 'http://simplegolftour.local:8123/api' : 'http://home.fransman.se:8123/api';

const exports = module.exports = {
  apiUrl: 'http://simplegolftour.local:8123/api',
  courseApiUrl: 'http://golfstats.fransman.se/tisdagsgolfendata'
};
