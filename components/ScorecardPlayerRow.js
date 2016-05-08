import React, {Component} from "react";
import {View, TouchableOpacity, Text, PickerIOS} from "react-native";

import styles from '../styles';
import realm from '../realm';

const STROKE_VALUES = [1,2,3,4,5,6,7,8,9,10];
const PUTT_VALUES = [0,1,2,3,4,5,6,7,8,9,10];
const BEER_VALUES = [0,1,2,3,4,5];


export default class ScorecardPlayerRow extends Component {
  constructor(props) {
    super(props);
    this.player = props.player;
    this.eventScore = props.player.eventScores.filtered(`hole == ${props.hole.number}`)[0];
  }

  showScoreForm() {
    realm.write(() => {
      this.player.isScoring = true;
    });
    this.forceUpdate();
  }

  closeScoreForm() {
    realm.write(() => {
      this.player.isScoring = false;
      this.eventScore.isScored = true;
    });
    this.forceUpdate();
  }

  setScoreData(value, dataType) {
    realm.write(() => {
      if(dataType === 'strokes') {
        this.eventScore.strokes = value;
      }

      if(dataType === 'putts') {
         this.eventScore.putts = value;
      }

      if(dataType === 'beers') {
         this.eventScore.beers = value;
      }
    });
    this.forceUpdate();
  }


  render() {
    const isScoredStyle = this.eventScore.isScored ? styles.isScored : styles.needsScore;
    let rowView = (
      <View style={styles.playerRow}>
        <Text style={styles.playerName}>{this.player.name}</Text>
        <Text style={[styles.playerHoleData, isScoredStyle]}>{this.eventScore.strokes}</Text>
        <Text style={[styles.playerHoleData, isScoredStyle]}>{this.eventScore.putts}</Text>
        <Text style={[styles.playerHoleData, isScoredStyle]}>{this.eventScore.beers}</Text>
      </View>
    );

    const strokePicker = (
      <PickerIOS
        style={styles.picker}
        selectedValue={this.eventScore.strokes}
        onValueChange={(strokes) => this.setScoreData(strokes, 'strokes')}>
        {STROKE_VALUES.map((val) => (
          <PickerIOS.Item
            key={val}
            value={val}
            label={`${val}`}
          />
        ))}
      </PickerIOS>
    );

    const puttPicker = (
      <PickerIOS
        style={styles.picker}
        selectedValue={this.eventScore.putts}
        onValueChange={(putts) => this.setScoreData(putts, 'putts')}>
        {PUTT_VALUES.map((val) => (
          <PickerIOS.Item
            key={val}
            value={val}
            label={`${val}`}
          />
        ))}
      </PickerIOS>
    );

    const beerPicker = (
      <PickerIOS
        style={styles.picker}
        selectedValue={this.eventScore.beers}
        onValueChange={(beers) => this.setScoreData(beers, 'beers')}>
        {BEER_VALUES.map((val) => (
          <PickerIOS.Item
            key={val}
            value={val}
            label={`${val}`}
          />
        ))}
      </PickerIOS>
    );

    let scoring;
    if(this.player.isScoring){
      scoring = (
        <View style={styles.scorebox}>
          <View style={{flexDirection: 'row'}}>
            {strokePicker}
            {puttPicker}
            {beerPicker}
          </View>
          <TouchableOpacity onPress={() => this.closeScoreForm()}>
            <Text style={styles.inlineBtn}>DONE</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      rowView = (
        <TouchableOpacity style={styles.scoreRow} onPress={() => this.showScoreForm()}>
          {rowView}
        </TouchableOpacity>
      );
    }

    return(
      <View style={(this.player.isScoring ? styles.scoring : styles.blank)} key={`player_row_${this.player.id}`}>
        {rowView}
        {scoring}
      </View>
    )
  }

}
