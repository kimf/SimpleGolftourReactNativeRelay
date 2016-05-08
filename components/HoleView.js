import React, {Component} from "react";
import {View, Text} from "react-native";
import ScorecardPlayerRow from './ScorecardPlayerRow';
import styles from '../styles';
import realm from '../realm';

export default class HoleView extends Component {
  render(){
    const { event, hole } = this.props;

    return(
      <View style={styles.hole} >
        <View style={styles.inlineHeader}>
          <Text style={styles.holeHeaderText}>Hål {hole.number}</Text>
        </View>
        {event.eventPlayers.map((player) => {
          return(
            <ScorecardPlayerRow
              player={player}
              hole={hole}
              key={`player_scorecard_row_${player.id}`}
            />
          )
        })}
      </View>
    )
  }
}
