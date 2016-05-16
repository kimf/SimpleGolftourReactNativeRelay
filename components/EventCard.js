'use strict';

import React, {Component} from "react";
import {Text, TouchableOpacity, View, StyleSheet} from "react-native";

import moment from 'moment';
import sv from 'moment/locale/sv';
import colors from '../common/colors';

export default class EventCard extends Component {
  render() {
    const { event, setupEvent } = this.props;

    return (
      <View style={[s.eventCard]}>
        <Text style={[s.row, s.date]}>
          {moment(event.startsAt).format('llll')}
        </Text>

        <View style={s.row}>
          <View style={{flex: 3}}>
            <Text style={s.gametype}>
              {event.teamEvent ? 'Lag' : 'Individuellt'}
              {` | `}
              {event.scoringType === 'points' ? 'Poäng' : 'Slag'}
            </Text>
            <Text style={{fontSize: 16, lineHeight: 25}}>{event.course ? event.course.club : null}</Text>
            <Text style={{fontSize: 16, lineHeight: 25}}>{event.course ? event.course.name : 'No Course set'}</Text>
          </View>
        </View>

        <View style={[s.row, s.buttonRow]}>

          <TouchableOpacity
            onPress={() => setupEvent(event)}
            style={s.scoreBtn}>
            <Text style={[s.eventCardBtn, {color: '#fff'}]}>SCORA</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.followEvent(event)}
              style={s.followBtn}>
            <Text style={[s.eventCardBtn, {color: '#777'}]}>FÖLJ</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const s = StyleSheet.create({
  /* EVENT CARDS */
  eventCard: {
    flexDirection: 'column',
    margin: 10,
    marginTop: 0,
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    borderColor: colors.cellBorder,
    borderWidth: StyleSheet.hairlineWidth,
    backgroundColor: '#fff'
  },

  row: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 10
  },

  buttonRow: {
    marginTop: 10,
  },

  date: {
    color: '#444',
    flex: 1,
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    flex: 1
  },

  gametype: {
    fontSize: 10,
    color: '#777',
  },

  eventCardBtn: {
    textAlign: 'center',
    padding: 10,
  },

  scoreBtn: {
    flex: 1,
    marginRight: 7,
    backgroundColor: colors.actionText,
  },

  followBtn: {
    flex: 1,
    marginLeft: 7,
    backgroundColor: '#feb',
  }
})
