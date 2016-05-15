import React, {Component} from "react";
import {View, TouchableOpacity, Text} from "react-native";

import styles from '../../styles';


export default class ScorecardRow extends Component {
  render() {
    const { player } = this.props;

    return(
      <View style={styles.listrow} key={`scorecard_player_row_${player.id}`}>
        <View style={styles.playerName}>
          <Text style={styles.flexOne}>{player.name}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.scoreHeader, styles.largeText]}>{player.totalStrokes}</Text>
          <Text style={[styles.scoreHeader, styles.largeText]}>{player.totalPutts}</Text>
          <Text style={[styles.scoreHeader, styles.largeText, styles.scorecardRowPoints]}>{player.totalPoints}</Text>
        </View>
      </View>
    )
  }

}
