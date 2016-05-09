'use strict';

import React, { Component } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import realm from '../realm';

import NavigationBar from 'react-native-navbar';

import styles from '../styles';

export default class ChoosePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = { players: realm.objects('Player').sorted('name') }
  }

  render() {
    const { dispatch } = this.props;
    const { players } = this.state;

    const titleConfig = { title: 'Välj Spelare', tintColor: 'white'  };
    const leftButtonConfig = {
      title: '< Bakåt',
      handler: () => dispatch({ type: 'back' }),
      tintColor: 'white'
    };
    const rightButtonConfig = {
      title: '+ Ny',
      handler: () => dispatch({ type: 'newPlayer' }),
      tintColor: 'white'
    };

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
          rightButton={rightButtonConfig}
        />
        <ScrollView>
          {players.map((player) => {
            return (
              <TouchableOpacity
                key={`choose_player_row_${player.id}`}
                style={styles.card}
                onPress={() => dispatch({ type: 'setupEventPlayer', needsSaving: true, player })}>
                <Text style={[styles.flexOne]}>
                  {player.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    )
  }
}
