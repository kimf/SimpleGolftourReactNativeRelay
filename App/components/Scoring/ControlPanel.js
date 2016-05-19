'use strict';

import React, {Component} from "react";
import {Alert, Text, TouchableOpacity, View} from "react-native";
import styles from '../../styles';
import realm from '../../../lib/AppRealm';

export default class ControlPanel extends Component {
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
    const { event, navigator } = this.props;

    realm.write(() => {
      for (let player of event.eventPlayers) {
        realm.delete(player.eventScores);
      }
      realm.delete(event.eventPlayers);
      event.isScoring = false;
      event.currentHole = 0;
      event.eventPlayers = [];
    });

    requestAnimationFrame(() => navigator.resetTo({ tab: 'leaderboard' }));
  }


  render() {
    const { onSelectHole, event } = this.props;
    return (
      <View style={styles.container}>
        <Text style={[styles.inlineHeader, styles.centerText]}>GÅ TILL HÅL</Text>
        <View style={{flex: 1, flexWrap: 'wrap', flexDirection: 'row', backgroundColor: '#ccc'}}>
          {event.course.holes.sorted('number').map((hole) => {
            return(
              <TouchableOpacity
                key={`holePicker_${hole.number}`}
                style={{width: 100, height: 80, margin: 5, backgroundColor: '#20395F', flexWrap: 'wrap'}}
                onPress={() => onSelectHole(hole.number)}>
                  <Text
                    style={{textAlign: 'center', lineHeight: 50, fontSize: 20, color: '#fff'}}>
                    {hole.number}
                  </Text>
              </TouchableOpacity>
            )
          })}
        </View>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.bottomBarBtn, styles.danger]}
            onPress={this.cancelScoring}>
              <Text style={styles.btnLabel}>AVSLUTA RUNDA</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
