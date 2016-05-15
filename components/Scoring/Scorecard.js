import React, {Component} from "react";
import {View, Text, TouchableOpacity} from "react-native";

import NavigationBar from 'react-native-navbar';

import ScoreRow from './ScoreRow';

import realm from '../../realm';
import styles from '../../styles';

export default class Scorecard extends Component {
  constructor(props) {
    super(props);
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
              <View style={styles.listrow} key={`scorecard_player_row_${player.id}`}>

                <View style={styles.playerName}>
                  <Text style={styles.flexOne}>{player.name}</Text>
                  <Text style={styles.flexOne, styles.meta}>{player.strokes} extraslag</Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text style={[styles.scoreHeader, styles.largeText]}>{player.totalStrokes}</Text>
                  <Text style={[styles.scoreHeader, styles.largeText]}>{player.totalPutts}</Text>
                  <Text style={[styles.scoreHeader, styles.largeText, styles.scorecardRowPoints]}>{player.totalPoints}</Text>
                </View>
              </View>
            )
          })}
      </View>
    )
  }
}
