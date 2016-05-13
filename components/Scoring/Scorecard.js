import React, {Component} from "react";
import {Alert, View, Text, TouchableOpacity} from "react-native";

import NavigationBar from 'react-native-navbar';

import ScorecardRow from './ScorecardRow';

import realm from '../../realm';
import styles from '../../styles';

export default class Scorecard extends Component {
  constructor(props) {
    super(props);
    this.cancelScoring = this.cancelScoring.bind(this);
    this.reallyCancelScoring = this.reallyCancelScoring.bind(this);
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
    const { event, navigator } = this.props;

    realm.write(() => {
      for (let player of event.eventPlayers) {
        realm.delete(player.eventScores);
      }
      realm.delete(event.eventPlayers);
      event.isScoring = false;
      event.currentHole = 0;
      event.eventPlayers = [];
    });

    requestAnimationFrame(() => navigator.resetTo({ tab: 'leaderboard' }));
  }

  render(){
    const { event, navigator } = this.props;

    const titleConfig = { title: 'Scorekort', tintColor: 'white'  };
    const lefButtonConfig = {
      title: '< Scora',
      handler: () => requestAnimationFrame(() => navigator.pop()),
      tintColor: 'white'
    };

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={lefButtonConfig} />

          <View style={styles.scoreHeaderRow}>
            <Text style={styles.scoreHeaderPlayer}>SPELARE</Text>
            <Text style={styles.scoreHeader}>BÄRS</Text>
            <Text style={styles.scoreHeader}>SLAG</Text>
            <Text style={styles.scoreHeader}>PUTTAR</Text>
            <Text style={styles.scoreHeader}>POÄNG</Text>
          </View>

          {event.eventPlayers.map((player) => {
            return(
              <ScorecardRow
                player={player}
                key={`player_scorecard_row_${player.id}`}
              />
            )
          })}

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.scorecardButton, {backgroundColor: 'red'}]}
              onPress={this.cancelScoring}>
                <Text style={styles.btnLabel}>AVSLUTA RUNDA</Text>
            </TouchableOpacity>
          </View>
      </View>
    )
  }
}
