'use strict';

import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";

import moment from 'moment';
import sv from 'moment/locale/sv';


import styles from '../styles';

export default class EventCard extends Component {
  render() {
    const { event, setupEvent } = this.props;

    return (
      <View style={[styles.eventCard, {backgroundColor: '#fff'}]}>
        <Text style={[styles.meta, {borderBottomWidth: 1, borderBottomColor: '#ccc', flex: 1}]}>
          {moment(event.startsAt).format('llll')}
        </Text>

        <Text style={{fontSize: 16, lineHeight: 20}}>{event.course ? event.course.club : null}</Text>
        <Text style={{fontSize: 16, lineHeight: 20}}>{event.course ? event.course.name : 'No Course set'}</Text>

        <Text style={{fontSize: 16, lineHeight: 20}}>{event.teamEvent ? 'Team Event' : 'Individual Event'}</Text>
        <TouchableOpacity onPress={() => setupEvent(event)} style={{flex: 1, flexDirection: 'column'}}>
          <Text style={{backgroundColor: '#ccc'}}>SCORA {event.scoringType}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
