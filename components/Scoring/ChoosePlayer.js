'use strict';

import React, { Component } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import NavigationBar from 'react-native-navbar';

import realm from '../../realm';
import styles from '../../styles';

export default class ChoosePlayer extends Component {
  constructor(props) {
    super(props);
    this.state = { players: realm.objects('Player').sorted('name') }
  }

  render() {
    const { event, navigator } = this.props;
    const { players } = this.state;

    const titleConfig = { title: 'Välj Spelare', tintColor: 'white'  };
    const leftButtonConfig = {
      title: '< Scora',
      handler: () => requestAnimationFrame(() => navigator.pop()),
      tintColor: 'white'
    };
    // const rightButtonConfig = {
    //   title: '+ Ny',
    //   handler: () => requestAnimationFrame(() => navigator.push()),
    //   tintColor: 'white'
    // };

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
        />
        <ScrollView>
          {players.map((player) => {
            if(event.eventPlayers.find((p) => p.id === player.id)){
              return null
            }

            return (
              <TouchableOpacity
                key={`choose_player_row_${player.id}`}
                style={styles.listrow}
                onPress={() => navigator.push({ setupEventPlayer: 1, needsSaving: true, player, event })}>
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
