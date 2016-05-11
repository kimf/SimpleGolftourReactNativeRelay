import React, {Component} from "react";
import { Alert, View, StyleSheet, ScrollView, Text, TouchableOpacity } from "react-native";

import NavigationBar from 'react-native-navbar';

import styles from '../../styles';
import realm from '../../realm';

export default class Scorecard extends Component {
  constructor(props) {
    super(props);
    this.cancelScoring = this.cancelScoring.bind(this);
    this.reallyCancelScoring = this.reallyCancelScoring.bind(this);
  }

  cancelScoring() {
    Alert.alert(
      'Avsluta rundan?',
      'Är du riktigt säker?',
      [
        {text: 'NEJ', onPress: () => console.log('Cancel'), style: 'cancel'},
        {text: 'JARÅ', onPress: () => this.reallyCancelScoring()},
      ]
    )
  }

  reallyCancelScoring() {
    const { event, appDispatch } = this.props;

    realm.write(() => {
      for (let player of event.eventPlayers) {
        realm.delete(player.eventScores);
      }
      realm.delete(event.eventPlayers);
      event.isScoring = false;
      event.currentHole = 0;
      event.eventPlayers = [];
    });

    appDispatch(false)
  }

  render() {
    const { event, dispatch } = this.props;

    const titleConfig = { title: 'Scorekort', tintColor: 'white' };
    const leftButtonConfig = {
      title: '< Bakåt',
      handler: () => dispatch({ type: 'closeScorecard' }),
      tintColor: 'white'
    };

    const cellStyle = {
      padding: 5,
      flex: 1,
      fontWeight: 'bold',
      color: '#444',
      backgroundColor: '#feb'
    };


    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          title={titleConfig}
          leftButton={leftButtonConfig}
        />

        <ScrollView>
          <View style={{flexDirection: 'row'}}>
            <View style={{flex: 1}}>
              <Text style={cellStyle}>
                Hål
              </Text>
              <Text style={cellStyle}>
                Par
              </Text>
              <Text style={cellStyle}>
                Index
              </Text>

              {event.eventPlayers.map((player) => {
                return(
                  <View style={{flex: 1}} key={`headerRowFor_${player.id}`}>
                    <Text style={[cellStyle, {backgroundColor: '#eee', marginTop: 10}]}>
                      {player.name.split(' ')[0]}
                    </Text>
                    <Text style={cellStyle}>
                      Slag
                    </Text>
                    <Text style={cellStyle}>
                      Poäng
                    </Text>
                  </View>
                )
              })}
            </View>

            <ScrollView horizontal style={{flex: 5}}>
              {event.course.holes.sorted('number').map((hole) => {
                return(
                  <View
                    style={{flex: 1, marginLeft: 1}}
                    key={`hole_info_player_hole_${hole.number}`}
                  >
                    <Text style={{padding: 5}}>{hole.number}</Text>
                    <Text style={{padding: 5}}>{hole.par}</Text>
                    <Text style={{padding: 5}}>{hole.index}</Text>

                    {event.eventPlayers.map((player) => {
                      eventScore = player.eventScores.find(s => s.hole === hole.number);
                      return(
                        <View key={`scoreRowFor_${player.id}`}>
                          <Text style={{padding: 5, marginTop: 10, backgroundColor: '#eee', color: '#ccc'}}>
                            {eventScore.extraStrokes}
                          </Text>
                          <Text style={{padding: 5}}>{eventScore.strokes}</Text>
                          <Text style={{padding: 5}}>{eventScore.points}</Text>
                        </View>
                      )
                    })}

                  </View>
                );
              })}
            </ScrollView>

            <View style={{flex: 1}}>
              <Text style={[cellStyle, {textAlign: 'right', color: '#feb'}]}>a</Text>
              <Text style={[cellStyle, {textAlign: 'right'}]}>{event.course.par}</Text>
              <Text style={[cellStyle, {textAlign: 'right', color: '#feb'}]}>b</Text>

              {event.eventPlayers.map((player) => {
                return(
                  <View style={{flex: 1}} key={`headerRowFor_${player.id}`}>
                    <Text style={[cellStyle, {textAlign: 'right', backgroundColor: '#eee', color: '#eee', marginTop: 10}]}>
                      c
                    </Text>
                    <Text style={[cellStyle, {textAlign: 'right'}]}>
                      {player.totalStrokes}
                    </Text>
                    <Text style={[cellStyle, {textAlign: 'right'}]}>
                      {player.totalPoints}
                    </Text>
                  </View>
                )
              })}
            </View>
          </View>
        </ScrollView>

        <TouchableOpacity
          style={[styles.btn, {backgroundColor: 'red'}]}
          onPress={this.cancelScoring}>
          <Text style={styles.btnLabel}>AVSLUTA RUNDA</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

// <ScorecardRow
//   player={player}
//   par={event.course.par}
//   key={`player_scorecard_scores_row_${player.id}`}
// />
