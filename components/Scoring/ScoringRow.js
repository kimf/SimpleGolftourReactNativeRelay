import React, {Component} from "react";
import {View, TouchableOpacity, Text, PickerIOS} from "react-native";

import styles from '../../styles';
import realm from '../../realm';

const STROKE_VALUES = [1,2,3,4,5,6,7,8,9,10];
const PUTT_VALUES = [0,1,2,3,4,5,6,7,8,9,10];
const BEER_VALUES = [0,1,2,3,4,5];
const pointsArray = []
pointsArray[-4] = 6;
pointsArray[-3] = 5;
pointsArray[-2] = 4;
pointsArray[-1] = 3;
pointsArray[0] = 2;
pointsArray[1] = 1;
pointsArray[2] = 0;
pointsArray[3] = 0;
pointsArray[4] = 0;

export default class ScoringRow extends Component {
  constructor(props) {
    super(props);
    this.eventScore = realm.objects('EventScore').filtered(`hole == "${props.holeNr}"`)[0];
    this.state = { strokes: this.eventScore.par, putts: this.eventScore.putts }
  }

  showScoreForm() {
    realm.write(() => {
      this.props.player.isScoring = true;
    });
    this.forceUpdate();
  }

  closeScoreForm() {
    realm.write(() => {
      this.props.player.isScoring = false;
      this.eventScore.isScored = true;

      this.eventScore.strokes = this.state.strokes;
      this.eventScore.putts = this.state.putts;

      const strokeSum = this.state.strokes - this.eventScore.extraStrokes;
      const testSum = strokeSum - this.eventScore.par;
      this.eventScore.points = pointsArray[testSum];
    });
    this.forceUpdate();
  }


  render() {
    const { player } = this.props;
    const isScored = this.eventScore.isScored;

    let resultsRow;
    if(isScored)     {
      resultsRow = (
        <View style={[styles.flexOne, {flexDirection: 'row'}]}>
          <Text style={styles.playerHoleData}>{this.eventScore.strokes}</Text>
          <Text style={styles.playerHoleData}>{this.eventScore.putts}</Text>
          <Text style={[styles.playerHoleData, styles.scorecardRowPoints]}>{this.eventScore.points}</Text>
        </View>
      );
    }

    let rowView = (
      <View style={styles.playerRow}>
        <View style={styles.playerName}>
          <Text style={styles.flexOne}>{player.name}</Text>
          <Text style={styles.flexOne}>{this.eventScore.extraStrokes > 0 ? `${this.eventScore.extraStrokes} slag` : ''}</Text>
        </View>
        {resultsRow}
      </View>
    );

    const strokePicker = (
      <PickerIOS
        style={styles.picker}
        selectedValue={this.state.strokes}
        onValueChange={(strokes) => this.setState({strokes})}>
        {STROKE_VALUES.map((val) => (
          <PickerIOS.Item
            key={val}
            value={val}
            label={`${val} slag`}
          />
        ))}
      </PickerIOS>
    );

    const puttPicker = (
      <PickerIOS
        style={styles.picker}
        selectedValue={this.state.putts}
        onValueChange={(putts) => this.setState({putts})}>
        {PUTT_VALUES.map((val) => (
          <PickerIOS.Item
            key={val}
            value={val}
            label={`${val} puttar`}
          />
        ))}
      </PickerIOS>
    );

    let scoring;
    if(player.isScoring){
      scoring = (
        <View style={styles.scorebox}>
          <Text style={styles.flexOne}>{player.name}</Text>
          <View style={{flexDirection: 'row'}}>
            {strokePicker}
            {puttPicker}
          </View>
          <TouchableOpacity onPress={() => this.closeScoreForm()}>
            <Text style={styles.inlineBtn}>DONE</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      scoring = (
        <TouchableOpacity style={styles.scoreRow} onPress={() => this.showScoreForm()}>
          {rowView}
        </TouchableOpacity>
      );
    }

    return(
      <View style={(player.isScoring ? styles.scoring : styles.blank)} key={`player_row_${player.id}`}>
        {scoring}
      </View>
    )
  }

}
