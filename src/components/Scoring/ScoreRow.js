import React, {Component} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import styles from '../../styles';
import realm from '../../../lib/AppRealm';

export default class ScoreRow extends Component {
  constructor(props) {
    super(props);
    const { player, holesCount, hole, eventScore, createEventScore } = this.props;

    if(eventScore === undefined) {
      let extraStrokes = 0;
      if(hole.index <= player.strokes) {
        extraStrokes = 1;
        if(player.strokes > holesCount) {
          if(hole.index <= (player.strokes - holesCount)){
            extraStrokes = 2;
          }
        }
      }

      createEventScore(player.id, hole.number, {
        extraStrokes: extraStrokes,
        hole: hole.number,
        index: hole.index,
        isScored: false,
        par: hole.par
      })
    }
  }


  render() {
    const {player, hole, showScoreForm, eventScore } = this.props;
    let scores;
    let extraStrokes = '';

    if(eventScore !== undefined) {
      for(let i=0; i < eventScore.extraStrokes; i++){
        extraStrokes = extraStrokes + '•';
      }

      if(eventScore.isScored) {
        scores = (
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.scoreHeader, styles.largeText]}>{eventScore.strokes}</Text>
            <Text style={[styles.scoreHeader, styles.largeText]}>{eventScore.putts}</Text>
            <Text style={[styles.scoreHeader, styles.largeText, styles.scorecardRowPoints]}>{eventScore.points}</Text>
          </View>
        );
      } else {
        scores = (
          <Text style={[styles.inlineBtn, {backgroundColor: '#fff', color: '#777', padding: 0, margin: 0}]}>
            LÄGG TILL SCORE
          </Text>
        );
      }
    }

    return(
      <TouchableOpacity
        key={`scoreRowDeluxe_${hole.id}_${player.id}`}
        style={styles.scoreRow}
        onPress={() => showScoreForm(player, eventScore)}>
        <View style={styles.listrow} key={`scoring_player_row_${player.id}`}>

          <View style={styles.playerName}>
            <Text style={styles.flexOne}>{player.name}</Text>
            <Text style={styles.flexOne}>{extraStrokes}</Text>
          </View>

          {scores}
        </View>
      </TouchableOpacity>
    )
  }
}
