import React, {Component} from "react";
import {Alert, View, TouchableOpacity, Text, PickerIOS, StatusBar, InteractionManager} from "react-native";

import styles from '../../styles';
import realm from '../../realm';

import { pushScoreToServer } from '../../lib/ApiService';

const STROKE_VALUES = [1,2,3,4,5,6,7,8,9,10];
const PUTT_VALUES = [0,1,2,3,4,5,6,7,8,9,10];
const BEER_VALUES = [0,1,2,3,4,5];
const pointsArray = []
pointsArray[-8] = 10;
pointsArray[-7] = 9;
pointsArray[-6] = 8;
pointsArray[-5] = 7;
pointsArray[-4] = 6;
pointsArray[-3] = 5;
pointsArray[-2] = 4;
pointsArray[-1] = 3;
pointsArray[0] = 2;
pointsArray[1] = 1;
pointsArray[2] = 0;
pointsArray[3] = 0;
pointsArray[4] = 0;
pointsArray[5] = 0;
pointsArray[6] = 0;
pointsArray[7] = 0;
pointsArray[8] = 0;
pointsArray[9] = 0;
pointsArray[10] = 0;


export default class ScoringScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      strokes: props.eventScore.strokes || props.par,
      putts: props.eventScore.putts || 2,
    }
    this.closeScoreForm = this.closeScoreForm.bind(this);
  }

  closeScoreForm() {
    StatusBar.setNetworkActivityIndicatorVisible(true);
    const { player, eventId, eventScore, sessionToken } = this.props;
    const { strokes, putts } = this.state;

    if(strokes - putts <= 0) {
      Alert.alert('Du verkar ha angett fler puttar än slag!')
    } else {
      realm.write(() => {
        eventScore.strokes = strokes;
        eventScore.putts = putts;

        const strokeSum = strokes - eventScore.extraStrokes;
        const testSum = strokeSum - eventScore.par;
        eventScore.points = parseInt(pointsArray[testSum], 10);
        eventScore.isScored = true;
      });

      pushScoreToServer(eventId, player.id, eventScore, sessionToken).then(() => {
        StatusBar.setNetworkActivityIndicatorVisible(false);
        requestAnimationFrame(() => this.props.closeScoreForm() );
      }).catch((error) => {
        StatusBar.setNetworkActivityIndicatorVisible(false);
        console.log('Error saving score', error);
        requestAnimationFrame(() => this.props.closeScoreForm() );
      });
    }
  }


  render() {
    const { player, eventScore } = this.props;

    return (
      <View style={styles.scoring}>
        <View style={styles.scorebox}>
          <Text style={styles.flexOne}>{player.name}</Text>
          <View style={{flexDirection: 'row'}}>
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
          </View>
          <TouchableOpacity onPress={() => this.closeScoreForm()}>
            <Text style={[styles.inlineBtn, {backgroundColor: 'green'}]}>SPARA SCORE</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}
