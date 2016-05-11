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
    this.state = {
      strokes: props.par,
      putts: 2,
      isScoring: false
    }
    this.closeScoreForm = this.closeScoreForm.bind(this);
  }

  componentWillMount() {
    const { player, holesCount, holeNr, par, index } = this.props;
    let eventScore = player.eventScores.find(s => s.hole === holeNr);

    if(eventScore !== undefined) {
      this.setState({eventScore: eventScore});
    } else {
      let extraStrokes = 0;
      if(index <= player.strokes) {
        extraStrokes = 1;
        if(player.strokes > holesCount) {
          if(index <= (player.strokes - holesCount)){
            extraStrokes = 2;
          }
        }
      }

      realm.write(() => {
        eventScore = realm.create('EventScore', {
          extraStrokes: extraStrokes,
          hole: holeNr,
          index: index,
          isScored: false,
          par: par
        });
        player.eventScores.push(eventScore);
      });

      this.setState({eventScore: eventScore});
    }
  }

  closeScoreForm() {
    const { player } = this.props;
    const { eventScore, strokes, putts } = this.state;
    realm.write(() => {
      eventScore.strokes = strokes;
      eventScore.putts = putts;

      const strokeSum = strokes - eventScore.extraStrokes;
      const testSum = strokeSum - eventScore.par;
      eventScore.points = pointsArray[testSum];
      eventScore.isScored = true;
    });
    this.setState({isScoring: false});
  }


  render() {
    const { player, showScorecard } = this.props;
    const { isScoring, eventScore } = this.state;
    const isScored = eventScore.isScored;

    let resultsRow;
    if(isScored)     {
      resultsRow = (
        <View style={{flexDirection: 'row'}}>
          <Text style={[styles.scoreHeader, styles.largeText]}>{showScorecard ? player.totalStrokes : eventScore.strokes}</Text>
          <Text style={[styles.scoreHeader, styles.largeText]}>{showScorecard ? player.totalPutts :eventScore.putts}</Text>
          <Text style={[styles.scoreHeader, styles.largeText, styles.scorecardRowPoints]}>{showScorecard ? player.totalPoints :eventScore.points}</Text>
        </View>
      );
    } else {
      resultsRow = <Text style={[styles.inlineBtn, {backgroundColor: '#fff', color: '#777', padding: 0, margin: 0}]}>
        LÄGG TILL SCORE
      </Text>;
    }

    let extraStrokes = ''
    for(let i=0; i<eventScore.extraStrokes; i++){
      extraStrokes = extraStrokes + '•';
    }

    let rowView = (
      <View style={styles.playerRow}>
        <View style={styles.playerName}>
          <Text style={styles.flexOne}>{player.name}</Text>
          <Text style={styles.flexOne}>
            {extraStrokes}
          </Text>
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
    if(isScoring){
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
        <TouchableOpacity style={styles.scoreRow} onPress={() => this.setState({isScoring: true})}>
          {rowView}
        </TouchableOpacity>
      );
    }

    return(
      <View style={(isScoring ? styles.scoring : styles.blank)} key={`player_row_${player.id}`}>
        {scoring}
      </View>
    )
  }

}
