'use strict';

import React, {Component} from "react";
import {Text, TouchableOpacity, View, StyleSheet, Linking} from "react-native";

import moment from 'moment';
import sv from 'moment/locale/sv';
import colors from '../colors';

export default class EventCard extends Component {
  constructor(props) {
    super(props);

    this.seeLeaderboard = this._seeLeaderboard.bind(this);
  }

  _seeLeaderboard(eventId) {
    Linking.openURL(`https://www.simplegolftour.com/tours/1/events/${eventId}`);
  }

  render() {
    const { event, setupEvent, scoreEvent, followEvent, scoringEvent } = this.props;


    let scoringBtn;

    if (event.status !== 'finished') {
      scoringBtn = (
        <TouchableOpacity
          onPress={() => setupEvent(event)}
          style={s.scoreBtn}>
          <Text style={[s.eventCardBtn, {color: '#fff'}]}>SCORA</Text>
        </TouchableOpacity>
      )
    }

    if(scoringEvent && event.id === scoringEvent.id) {
      scoringBtn = (
        <TouchableOpacity
          onPress={() => scoreEvent(scoringEvent)}
          style={s.scoringBtn}>
          <Text style={[s.eventCardBtn, {color: '#fff'}]}>FORTSÄTT</Text>
        </TouchableOpacity>
      )
    }

    let resultsBtn;
    if(event.status === 'finished') {
      resultsBtn = (
        <TouchableOpacity
          onPress={() => this.seeLeaderboard(event.id)}
            style={s.followBtn}>
          <Text style={[s.eventCardBtn, {color: '#777'}]}>SE RESULTAT</Text>
        </TouchableOpacity>
      )
    } else if(event.is_scoring) {
      resultsBtn = (
        <TouchableOpacity
          onPress={() => followEvent(event)}
            style={s.followBtn}>
          <Text style={[s.eventCardBtn, {color: '#777'}]}>FÖLJ LIVE</Text>
        </TouchableOpacity>
      )
    }

    return (
      <View style={[s.eventCard]}>
        <Text style={[s.row, s.date]}>
          {moment(event.starts_at).format('llll')}
        </Text>

        <View style={s.row}>
          <View style={{flex: 3}}>
            <Text style={s.gametype}>
              {event.team_event ? 'Lag' : 'Individuellt'}
              {` | `}
              {event.scoring_type === 'points' ? 'Poäng' : 'Slag'}
            </Text>
            <Text style={{fontSize: 16, lineHeight: 25}}>{event.club}</Text>
            <Text style={{fontSize: 16, lineHeight: 25}}>{event.course}</Text>
          </View>
        </View>

        <View style={[s.row, s.buttonRow]}>
          {scoringBtn}
          {resultsBtn}
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
    backgroundColor: '#fff',
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

  scoringBtn: {
    flex: 1,
    marginRight: 7,
    backgroundColor: 'green',
  },

  followBtn: {
    flex: 1,
    marginLeft: 7,
    backgroundColor: '#feb',
  }
})
