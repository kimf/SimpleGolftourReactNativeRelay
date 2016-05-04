'use strict';

import React, {
  Component,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import moment from 'moment';
const styles = require('../styles.js');

class EventCard extends Component {
  render() {
    const { event, dispatch } = this.props;
    let today;
    if(moment(event.starts_at).isSame(Date.now(), 'day')){
      today = (
        <Text style={styles.todayBanner}>IDAG</Text>
      );
    }

    return(
      <View style={[styles.card, styles.eventCard]}>
        {today}
        <Text>{event.status}</Text>
        <Text>Starts at: {event.starts_at}</Text>
        <Text>Gametype: {event.gametype}</Text>
        <Text>Course: {event.course}</Text>
        <Text>Scoring: {event.scoring_type}</Text>
        <Text>{event.team_event ? 'Team Event' : 'Individual Event'}</Text>
        <TouchableOpacity onPress={() => dispatch({ type: 'selectPlayers', event: event})}>
          <Text style={styles.inlineBtn}>
            {event.status === 'planned' ? 'SCORA' : 'REDIGERA'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default class EventList extends Component {

  render() {
    const { events, dispatch } = this.props;

    return(
      <View style={styles.container}>
        <ScrollView>
           {events.map(event =>
              <EventCard key={event.id} event={event} dispatch={dispatch} />
           )}
        </ScrollView>
      </View>
    )
  }
}
