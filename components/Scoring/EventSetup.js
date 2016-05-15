'use strict';

import React, {Component} from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import NavigationBar from 'react-native-navbar';

import realm from '../../realm';
import styles from '../../styles';

export default class EventSetup extends Component {
  componentWillMount() {
    const { event, currentUserId } = this.props;
    let eventPlayer = event.eventPlayers.filtered(`id == ${currentUserId}`);
    if(eventPlayer.length === 0) {
      const player = realm.objects('Player').find((p) => p.id === currentUserId);
      realm.write(() => {
        const eventPlayer = realm.create(
          'EventPlayer', {
            id: player.id,
            name: player.name,
            strokes: 0,
            eventScores: []
          }, true);
        event.eventPlayers.push(eventPlayer);
      });
      this.forceUpdate();
    }

    this.abort = this.abort.bind(this);
  }

  goPlay() {
    const { event, navigator } = this.props;
    realm.write(() => {
      event.isScoring = true
      event.currentHole = 1
    })
    requestAnimationFrame(() => navigator.resetTo({ scoreEvent: 1, event: event }));
  }

  abort() {
    const { event, navigator } = this.props;
    realm.write(() => {
      realm.delete(event.eventPlayers);
    });
    requestAnimationFrame(() => navigator.resetTo({ tab: 'events' }));
  }

  render() {
    const { event, navigator } = this.props;
    const titleConfig = { title: 'Scora', tintColor: 'white'  };
    const leftButtonConfig = {
      title: 'Avbryt',
      handler: () => this.abort(),
      tintColor: 'white'
    };

    const newPlayer = (
      <View style={[styles.listrow, {justifyContent: 'flex-end', borderBottomWidth: 0}]}>
        <TouchableOpacity
          style={[styles.inlineButton]}
          onPress={() => navigator.push({selectPlayer: 1, event: event})}>
          <Text style={styles.centerText}>LÄGG TILL SPELARE</Text>
        </TouchableOpacity>
      </View>
    );

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
        />

        <View style={styles.inlineHeader}>
          <Text style={styles.centerText}>Vilka spelare för du score för?</Text>
        </View>

        <ScrollView>
          {event.eventPlayers.map((player) => {
            return (
              <TouchableOpacity
                key={`setup_player_row_${player.id}`}
                style={styles.listrow}
                onPress={() => navigator.push({ setupEventPlayer: 1, player, event })}>
                <Text style={[styles.flexOne]}>
                  {player.name}
                </Text>
                <Text style={styles.strokeInfo}>Slag: {player.strokes}</Text>
              </TouchableOpacity>
            );
          })}

          {newPlayer}
        </ScrollView>

        <TouchableOpacity
          style={styles.btn}
          onPress={() => this.goPlay()}>
          <Text style={styles.btnLabel}>STARTA RUNDA</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
