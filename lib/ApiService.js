const devBuild = process.env.NODE_ENV !== 'production'

const apiUrl = devBuild ? 'http://simplegolftour.local:8123/api' : 'http://simplegolftour.com/api'

const exports = module.exports = {
  apiUrl: apiUrl
};
