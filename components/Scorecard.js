import React, {Component} from "react";
import { Alert, View, ScrollView, Text, TouchableOpacity } from "react-native";

import ScorecardRow from './ScorecardRow';
import styles from '../styles';

export default class Scorecard extends Component {
  constructor(props) {
    super(props);
    this.cancelScoring = this.cancelScoring.bind(this);
  }

  cancelScoring() {
    const { event, dispatch } = this.props;
    Alert.alert(
      'Avsluta rundan?',
      'Är du riktigt säker?',
      [
        {text: 'NEJ', onPress: () => console.log('Cancel'), style: 'cancel'},
        {text: 'JARÅ', onPress: () => dispatch({type: 'cancelScoring', event: event})},
      ]
    )
  }

  render() {
    const { event, dispatch } = this.props;

    return(
      <View style={styles.container}>
        <ScrollView>
          {event.eventPlayers.map((player) => {
            return(
              <ScorecardRow
                player={player}
                key={`player_scorecard_scores_row_${player.id}`}
              />
            )
          })}
        </ScrollView>

        <TouchableOpacity
          style={styles.btn}
          onPress={this.cancelScoring}>
          <Text style={styles.btnLabel}>AVSLUTA RUNDA</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
