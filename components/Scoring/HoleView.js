import React, {Component} from "react";
import {View, Text} from "react-native";
import ScoringRow from './ScoringRow';
import styles from '../../styles';
import realm from '../../realm';

export default class HoleView extends Component {
  render(){
    const { event, hole } = this.props;

    return(
      <View style={styles.hole} >
        <View style={styles.inlineHeader}>
          <Text style={styles.holeHeaderText}>Hål {hole.number} - Par {hole.par} - Index: {hole.index}</Text>
        </View>
        {event.eventPlayers.map((player) => {
          return(
            <ScoringRow
              player={player}
              holeNr={hole.number}
              key={`player_scorecard_row_${player.id}`}
            />
          )
        })}
      </View>
    )
  }
}
