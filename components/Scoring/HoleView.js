import React, {Component} from "react";
import {View, Text} from "react-native";
import ScoringRow from './ScoringRow';
import styles from '../../styles';
import realm from '../../realm';

export default class HoleView extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    const { event, hole } = this.props;

    return(
      <View>
        <View style={styles.inlineHeader}>
          <Text style={[styles.holeHeaderText]}>
            {`Hål ${hole.number} - Par ${hole.par} - Index: ${hole.index}`}
          </Text>
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
              key={`player_scoring_row_${player.id}`}
            />
          )
        })}
      </View>
    )
  }
}
