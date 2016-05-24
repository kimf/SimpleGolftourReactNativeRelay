import React, {Component} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import styles from '../../styles';

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
    const {teamEvent, player, hole, showScoreForm, eventScore, scoringType } = this.props;
    let scores;
    let extraStrokes = '';

    if(eventScore !== undefined) {
      for(let i=0; i < eventScore.extraStrokes; i++){
        extraStrokes = extraStrokes + '•';
      }

      const puttsBeingSaved = teamEvent ? null : (
        <Text style={[styles.scoreHeader, styles.largeText, {color: '#feb'}]}>
          {eventScore.putts}
        </Text>
      )

      const eventPutts = teamEvent ? null : (
        <Text style={[styles.scoreHeader, styles.largeText]}>{eventScore.putts}</Text>
      )

      if(eventScore.isScored) {
        scores = (
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.scoreHeader, styles.largeText, (scoringType === 'strokes' ? styles.scorecardRowPoints : null)]}>
              {eventScore.strokes}
            </Text>
            {eventPutts}
            <Text style={[styles.scoreHeader, styles.largeText, (scoringType === 'points' ? styles.scorecardRowPoints : null)]}>
              {eventScore.points}
            </Text>
          </View>
        );
      } else if (eventScore.isBeingSaved){
        scores = (
          <View style={{flexDirection: 'row', opacity: 0.5}}>
            <Text style={[styles.scoreHeader, styles.largeText, {color: '#feb'}]}>
              {eventScore.strokes}
            </Text>
            {puttsBeingSaved}
            <Text style={[styles.scoreHeader, styles.largeText, styles.scorecardRowPoints, {color: '#feb'}]}>
              {eventScore.points}
            </Text>
          </View>
        )
      } else if (eventScore.hasError) {
        scores = (
          <Text style={[styles.inlineBtn, {backgroundColor: '#fff', color: '#c00', padding: 0, margin: 0}]}>
            NÅGOT GICK FEL, PRÖVA IGEN!
          </Text>
        );
      } else {
        scores = (
          <Text style={[styles.inlineBtn, {backgroundColor: '#fff', color: '#777', padding: 0, margin: 0}]}>
            LÄGG TILL SCORE
          </Text>
        );
      }
    }

    let playerNames = null;
    if(teamEvent) {
      playerNames = player.players.map(p => {
        return <Text key={`team_player_name_${p.id}`} style={styles.meta}>{p.name}</Text>
      })
    }

    return(
      <TouchableOpacity
        key={`scoreRowDeluxe_${hole.id}_${player.id}`}
        style={styles.scoreRow}
        onPress={() => showScoreForm(player, eventScore)}>
        <View style={styles.listrow} key={`scoring_player_row_${player.id}`}>

          <View style={styles.playerName}>
            <Text style={styles.flexOne}>
              {teamEvent ? `Lag ${player.id+1}` : player.name}
            </Text>
            {playerNames}
            <Text style={styles.flexOne}>{extraStrokes}</Text>
          </View>

          {scores}
        </View>
      </TouchableOpacity>
    )
  }
}
