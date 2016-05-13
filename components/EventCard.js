'use strict';

import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";

import moment from 'moment';

import styles from '../styles';

export default class EventCard extends Component {
  render() {
    const { event, setupEvent } = this.props;

    const btnStyle = moment(event.startsAt).isSame(Date.now(), 'day')
                     ? styles.todayBtn
                     : styles.inlineBtn
    return (
      <View style={[styles.card, styles.eventCard]}>
        <Text>{event.status}</Text>
        <Text>Starts at: {moment(event.startsAt).format('MMMM Do, H:mm YYYY')}</Text>
        <Text>Course: {event.course ? event.course.name : 'No Course set'}</Text>
        <Text>Scoring: {event.scoringType}</Text>
        <Text>{event.teamEvent ? 'Team Event' : 'Individual Event'}</Text>
        <TouchableOpacity onPress={() => setupEvent(event)}>
          <Text style={btnStyle}>
            {event.status === 'planned' ? 'SCORA' : 'REDIGERA'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
