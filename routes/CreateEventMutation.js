'use strict';

import Relay, { Mutation } from 'react-relay';

export default class CreateEventMutation extends Mutation {
  // Get the name of the mutation on server, so that we can call the server
  getMutation() {
    return Relay.QL`mutation{ createEvent }`;
  }

  // Map the props passed to mutation to the server input object
  getVariables() {
    return {
      starts_at: this.props.starts_at,
      course: this.props.course,
      date: this.props.date,
      scoring_type: this.props.scoring_type,
      gametype: this.props.gametype
    };
  }

  // Define a query on the resulting payload, with all the data that changed
  getFatQuery() {
    return Relay.QL`
      fragment on _EventPayload {
        createdEvent {
          id
          starts_at
          course
          date
          scoring_type
          gametype
          team_event
          status
        }
      }
    `;
  }

  // Define what exactly Relay should change in the store. In this case
  // we say that it should match the item from `createdEvent` element in the
  // result with an item in the store by id and then update the item in the
  // store
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        createdEvent: this.props.id,
      },
    }];
  }

  // To make Relay make an optimistic update, we need to "fake" the response
  // from the server. Here it's pretty easy.
  getOptimisticResponse() {
    return {
      createdEvent: {
        starts_at: this.props.starts_at,
        course: this.props.course,
        scoring_type: this.props.scoring_type,
        gametype: this.props.gametype,
        team_event: this.props.team_event,
        status: 'planned'
      },
    };
  }
}
