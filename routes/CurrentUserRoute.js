'use strict';

import Relay, { Route } from 'react-relay';

export default class CurrentUserRoute extends Route {
  static queries = {
    currentUser: () => Relay.QL`query { currentUser }`,
  };
  static routeName = 'CurrentUserRoute';
}
