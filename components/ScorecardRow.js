import React, {Component} from "react";
import {View, Text} from "react-native";
import ScoringRow from './ScoringRow';
import styles from '../styles';
import realm from '../realm';

export default class ScorecardRow extends Component {
  render(){
    //🍺
    const { player } = this.props;

    const holes = [];
    const pars = [];
    const strokes = [];
    const putts = [];
    const points = [];

    player.eventScores.sorted('hole').map((score) => {
      if(score.isScored) {
        strokes.push(score.strokes);
        putts.push(score.putts);
        points.push(score.points);
      } else {
        strokes.push(0);
        putts.push(0);
        points.push(0);
      }
    })

    const totalPars = pars.reduce((a, b) => a + b, 0);
    const totalStrokes = strokes.reduce((a, b) => a + b, 0);
    const totalPutts = putts.reduce((a, b) => a + b, 0);
    const totalPoints = points.reduce((a, b) => a + b, 0);

    return(
      <View style={styles.scoreRow} >
        <Text style={styles.playerHoleData}>{player.name}</Text>
        <Text>🍺🍺🍺</Text>
        <View style={[styles.flexOne, {flexDirection: 'row'}]}>
          <Text style={{fontSize: 4, flex: 3, margin: 1, backgroundColor: '#eee', padding: 5}}>SLAG</Text>
          {strokes.map((stroke) => {
            return(
              <Text style={{fontSize: 8, flex: 1, margin: 1, backgroundColor: '#eee', padding: 5}}>{stroke}</Text>
            )
          })}
          <Text style={{fontSize: 8, flex: 1, margin: 1, backgroundColor: '#000', padding: 5, color: '#fff'}}>{totalStrokes}</Text>
        </View>
        <View style={[styles.flexOne, {flexDirection: 'row'}]}>
          <Text style={{fontSize: 4, flex: 3, margin: 1, backgroundColor: '#eee', padding: 5}}>PUTTAR</Text>
          {putts.map((putt) => {
            return(
              <Text style={{fontSize: 8, flex: 1, margin: 1, backgroundColor: '#eee', padding: 5}}>{putt}</Text>
            )
          })}
          <Text style={{fontSize: 8, flex: 1, margin: 1, backgroundColor: '#000', padding: 5, color: '#fff'}}>{totalPutts}</Text>
        </View>
        <View style={[styles.flexOne, {flexDirection: 'row'}]}>
          <Text style={{fontSize: 4, flex: 3, margin: 1, backgroundColor: '#eee', padding: 5}}>POÄNG</Text>
          {points.map((point) => {
            return(
              <Text style={{fontSize: 8, flex: 1, margin: 1, backgroundColor: '#eee', padding: 5}}>{point}</Text>
            )
          })}
          <Text style={{fontSize: 8, flex: 1, margin: 1, backgroundColor: '#000', padding: 5, color: '#fff'}}>{totalPoints}</Text>
        </View>
      </View>
    )
  }
}
