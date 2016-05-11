import React, {Component} from "react";
import {
  Alert, View, Text, TouchableOpacity, ScrollView, StatusBar
} from "react-native";

import NavigationBar from 'react-native-navbar';
import SwipeableViews from 'react-swipeable-views/lib/index.native.animated';
import moment from 'moment';

import HoleView from './HoleView';
import Loading from '../shared/Loading';

import styles from '../../styles';
import realm from '../../realm';
import { apiUrl } from '../../lib/ApiService';

export default class ScoreEvent extends Component {
  constructor(props) {
    super(props);
    this.state = { hole: null };
    this.changeHole = this.changeHole.bind(this);
    this.cancelScoring = this.cancelScoring.bind(this);
    this.reallyCancelScoring = this.reallyCancelScoring.bind(this);
    this.saveRound = this.saveRound.bind(this);
  }

  saveRound() {
    const { event, appDispatch, sessionToken } = this.props;
    const url = apiUrl + '/events/' + event.id;

    StatusBar.setNetworkActivityIndicatorVisible(true);

    const data = [];
    event.eventPlayers.map(p => {
      const playerData = {
        id: p.id,
        beers: p.beers,
        points: p.totalPoints,
        strokes: p.totalStrokes,
        scores: [],
      }
      p.eventScores.filtered('isScored == true').map(s => {
        playerData.scores.push({
          index: s.index,
          hole: s.hole,
          par: s.par,
          extraStrokes: s.extraStrokes,
          strokes: s.strokes,
          putts: s.strokes,
          points: s.points
        });
      });

      data.push(playerData);
    });

    fetch(url, {
      method: 'PUT',
      crossOrigin: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${sessionToken}`
      },
      body: JSON.stringify({players: data})
    })
    .then((response) => {
      return response.json()
    })
    .then((event) => {
      realm.write(() => {
        realm.create('Event', {
          id: event.id,
          status: event.status,
          isScoring: false
        }, true);
      });
      appDispatch({ type: 'back' });
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }).catch((error) => {
      StatusBar.setNetworkActivityIndicatorVisible(false);
      alert('Kunde inte spara runda, Var god se över informationen');
      console.log('Error retreiving data', error);
    })
  }

  cancelScoring() {
    Alert.alert(
      'Avsluta rundan?',
      'Är du riktigt säker?',
      [
        {text: 'NEJ', onPress: () => console.log('Cancel'), style: 'cancel'},
        {text: 'JARÅ', onPress: () => this.reallyCancelScoring()},
      ]
    )
  }

  reallyCancelScoring() {
    const { event, appDispatch } = this.props;

    realm.write(() => {
      for (let player of event.eventPlayers) {
        realm.delete(player.eventScores);
      }
      realm.delete(event.eventPlayers);
      event.isScoring = false;
      event.currentHole = 0;
      event.eventPlayers = [];
    });

    appDispatch(false)
  }

  componentDidMount() {
    const { event } = this.props
    const hole = event.course.holes.find(h => h.number === event.currentHole);
    this.setState({ hole });
  }

  changeHole(newHoleNr) {
    const { event } = this.props;
    realm.write(() => {
       event.currentHole = newHoleNr;
    });
    const hole = event.course.holes.find(h => h.number === newHoleNr);
    this.setState({ showScorecard: false, hole });
  }

  render() {
    const { event, dispatch } = this.props;
    const { hole, showScorecard } = this.state;

    const titleConfig = { title: event.course.name, tintColor: 'white'  };

    if(hole) {

      let prevHole;
      if(!showScorecard && hole.number > 1) {
        const newHoleNr = hole.number -1;
        prevHole = (
          <TouchableOpacity
            style={styles.holeSwitchButton}
            onPress={() => this.changeHole(newHoleNr)}>
            <Text style={styles.holeSwitchButtonLabel}>← HÅL {newHoleNr}</Text>
          </TouchableOpacity>
        );
      }

      let nextHole;
      if(!showScorecard && hole.number !== event.course.holes_count) {
        const newHoleNr = hole.number + 1;
        nextHole = (
          <TouchableOpacity
            style={[styles.holeSwitchButton]}
            onPress={() => this.changeHole(newHoleNr)}>
            <Text style={styles.holeSwitchButtonLabel}>HÅL {newHoleNr} →</Text>
          </TouchableOpacity>
        );
      } else if(!showScorecard && hole.number === event.course.holes_count) {
        nextHole = (
          <TouchableOpacity
            style={[styles.holeSwitchButton, {backgroundColor: 'green'}]}
            onPress={() => this.saveRound()}>
            <Text style={styles.holeSwitchButtonLabel}>SPARA RUNDA</Text>
          </TouchableOpacity>
        );
      }

      let scorecardBtn;
      if(showScorecard) {
        scorecardBtn = (
          <TouchableOpacity
            style={styles.scorecardButton}
            onPress={() => this.setState({ showScorecard: false })}>
            <Text style={styles.scorecardButtonLabel}>DÖLJ SCOREKORT</Text>
          </TouchableOpacity>
        );
      } else {
        scorecardBtn = (
          <TouchableOpacity
            style={styles.scorecardButton}
            onPress={() => this.setState({ showScorecard: true })}>
            <Text style={styles.scorecardButtonLabel}>VISA SCOREKORT</Text>
          </TouchableOpacity>
        );
      }

      let cancelRndBtn;
      if(showScorecard) {
        cancelRndBtn = (
          <TouchableOpacity
            style={[styles.scorecardButton, {backgroundColor: 'red'}]}
            onPress={this.cancelScoring}>
            <Text style={styles.btnLabel}>AVSLUTA RUNDA</Text>
          </TouchableOpacity>
        );
      }

      return(
        <View style={styles.container}>
          <NavigationBar
            style={styles.header}
            title={titleConfig}
            statusBar={{style: 'light-content', tintColor: '#477dca'}} />


          <HoleView
            style={{flex: 1}}
            key={`hole_view_${hole.id}`}
            hole={hole}
            event={event}
            showScorecard={showScorecard} />

          <View style={styles.bottomBar}>
            {prevHole}
            {scorecardBtn}
            {cancelRndBtn}
            {nextHole}
          </View>
        </View>
      );
    } else {
      return <Loading />;
    }
  }
}
