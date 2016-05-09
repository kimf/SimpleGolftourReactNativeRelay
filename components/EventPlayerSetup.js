'use strict';

import React, {Component} from "react";
import {Text, TextInput, TouchableOpacity, ListView, View} from "react-native";

import NavigationBar from 'react-native-navbar';

import styles from '../styles';
import realm from '../realm';

export default class EventPlayerSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {strokes: (props.player.strokes || '') };
  }

  goBack() {
    const { event, needsSaving, player, dispatch } = this.props;
    const strokes = parseInt(this.state.strokes);

    realm.write(() => {
      if(needsSaving) {
        event.eventPlayers.push({
          id: player.id,
          name: player.name,
          strokes: strokes,
          isScoring: false,
          eventScores: []
        });
      } else {
        player.strokes = strokes;
      }
    });
    dispatch({ type: 'eventPlayerWasSetup' });
  }

  render() {
    const { player, dispatch } = this.props;
    const { strokes } = this.state;

    const titleConfig = { title: 'Kolla Antal slag', tintColor: 'white'  };
    const leftButtonConfig = {
      title: '< Bakåt',
      handler: () => dispatch({ type: 'back' }),
      tintColor: 'white'
    };

    const rightButtonConfig = {
      title: '✓ OK',
      handler: () => this.goBack(),
      tintColor: 'white'
    };

    return(
      <View style={[styles.container, {backgroundColor: '#ccc'}]}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
          rightButton={rightButtonConfig}
        />


        <View style={styles.card} key={`hcp_row_for_player_${player.id}`}>
          <View style={styles.cardTitle}>
            <Text style={styles.label}>Hur många slag har {player.name}?</Text>
            <TextInput
              style={styles.inputField}
              autoCapitalize="none"
              keyboardType="number-pad"
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
