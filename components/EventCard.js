'use strict';

import React, {
  Component,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import moment from 'moment';

import styles from '../styles';

export default class EventCard extends Component {
  render() {
    const { event, dispatch } = this.props;

    const editOrScoreStyle = event.status === 'planned'
                             ? moment(event.startsAt).isSame(Date.now(), 'day')
                               ? styles.todayBtn
                               : styles.inlineBtn
                             : styles.scoredEventBtn
    return(
      <View style={[styles.card, styles.eventCard]}>
        <Text>{event.status}</Text>
        <Text>Starts at: {moment(event.startsAt).format('MMMM Do, H:mm YYYY')}</Text>
        <Text>Gametype: {event.gametype}</Text>
        <Text>Course: {event.courseName}</Text>
        <Text>Scoring: {event.scoringType}</Text>
        <Text>{event.teamEvent ? 'Team Event' : 'Individual Event'}</Text>
        <TouchableOpacity onPress={() => dispatch({ type: 'selectPlayers', event: event})}>
          <Text style={editOrScoreStyle}>
            {event.status === 'planned' ? 'SCORA' : 'REDIGERA'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}