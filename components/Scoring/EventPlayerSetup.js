'use strict';

import React, {Component} from "react";
import {Text, TextInput, TouchableOpacity, ListView, View} from "react-native";

import NavigationBar from 'react-native-navbar';

import styles from '../../styles';
import realm from '../../realm';

export default class EventPlayerSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {strokes: (props.player.strokes || 0) };
  }

  confirm() {
    const { event, needsSaving, player, navigator } = this.props;
    const strokes = parseInt(this.state.strokes);

    realm.write(() => {
      if(needsSaving) {
        event.eventPlayers.push({
          id: player.id,
          name: player.name,
          strokes: strokes,
          eventScores: []
        });
      } else {
        player.strokes = strokes;
      }
    });
    requestAnimationFrame(() => navigator.resetTo({ setupEvent: 1, event: event }));
  }

  render() {
    const { player, navigator } = this.props;
    const { strokes } = this.state;

    const titleConfig = { title: 'Spel HCP', tintColor: 'white'  };
    const leftButtonConfig = {
      title: '< Tillbaka',
      handler: () => requestAnimationFrame(() => navigator.pop()),
      tintColor: 'white'
    };

    const rightButtonConfig = {
      title: '✓ OK',
      handler: () => this.confirm(),
      tintColor: 'white'
    };

    return(
      <View style={[styles.container, {backgroundColor: '#eee'}]}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
          rightButton={rightButtonConfig}
        />


        <View style={styles.listrow} key={`hcp_row_for_player_${player.id}`}>
          <View style={styles.cardTitle}>
            <Text style={styles.label}>Hur många extra-slag har {player.name}?</Text>
            <TextInput
              style={[styles.inputField, {height: 200, fontSize: 100, textAlign: 'center'}]}
              autoCapitalize="none"
              keyboardType="number-pad"
              autoFocus
              selectTextOnFocus
              ref="strokes"
              onChangeText={(strokes) => this.setState({strokes})}
              value={`${strokes}`}
            />
          </View>
        </View>
      </View>
    )
  }
}
