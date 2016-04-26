'use strict';

import Relay, { Route } from 'react-relay'

export default class TourRoute extends Route {
  static queries = {
    tour: () => Relay.QL`query { tour(id: 1) }`
  };
  static routeName = 'TourRoute';
}
