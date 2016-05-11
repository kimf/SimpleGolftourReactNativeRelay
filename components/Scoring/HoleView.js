import React, {Component} from "react";
import {View, Text, StyleSheet} from "react-native";
import ScoringRow from './ScoringRow';
import styles from '../../styles';
import realm from '../../realm';

export default class HoleView extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    const { event, hole, showScorecard } = this.props;

    let headerText = ''
    if(showScorecard) {
      headerText = 'VISAR SCOREKORT';
    } else {
      headerText = `Hål ${hole.number} - Par ${hole.par} - Index: ${hole.index}`;
    }

    return(
      <View style={styles.hole} >
        <View style={[styles.inlineHeader, {backgroundColor: showScorecard ? '#c00' : '#eee'}]}>
          <Text style={styles.holeHeaderText}>{headerText}</Text>
        </View>

        <View style={styles.scoreHeaderRow}>
          <Text style={styles.scoreHeaderPlayer}>SPELARE</Text>
          <Text style={styles.scoreHeader}>SLAG</Text>
          <Text style={styles.scoreHeader}>PUTTAR</Text>
          <Text style={[styles.scoreHeader]}>POÄNG</Text>
        </View>

        {event.eventPlayers.map((player) => {
          return(
            <ScoringRow
              player={player}
              holesCount={event.course.holes_count}
              holeNr={hole.number}
              par={hole.par}
              index={hole.index}
              showScorecard={showScorecard}
              key={`player_scorecard_row_${player.id}`}
            />
          )
        })}
      </View>
    )
  }
}
