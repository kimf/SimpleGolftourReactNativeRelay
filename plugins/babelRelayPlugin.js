var getbabelRelayPlugin = require('babel-relay-plugin');
var schema = require('../../../graphql_play/server_simple_golftour/public/relay/schema.json');

module.exports = getbabelRelayPlugin(schema.data);
