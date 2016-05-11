'use strict';

import React, {Component} from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import NavigationBar from 'react-native-navbar';

import realm from '../../realm';
import styles from '../../styles';

export default class EventSetup extends Component {
  componentWillMount() {
    const { event, currentUserId } = this.props;
    let eventPlayer = event.eventPlayers.filtered(`id = ${currentUserId}`);
    if(eventPlayer.length === 0) {
      const player = realm.objects('Player').find((p) => p.id === currentUserId);
      realm.write(() => {
        event.eventPlayers.push({
          id: player.id,
          name: player.name,
          strokes: 0,
          eventScores: []
        });
      });
      this.forceUpdate();
    }

    this.abort = this.abort.bind(this);
  }

  abort() {
    const { event, appDispatch } = this.props;
    realm.write(() => {
      realm.delete(event.eventPlayers);
    });
    appDispatch({type: 'back'});
  }

  render() {
    const { event, dispatch } = this.props;
    const titleConfig = { title: 'Välj Spelare', tintColor: 'white'  };
    const leftButtonConfig = {
      title: '< Bakåt',
      handler: () => this.abort(),
      tintColor: 'white'
    };

    const newPlayer = (
      <View style={[styles.card, {justifyContent: 'flex-end', borderBottomWidth: 0}]}>
        <TouchableOpacity style={[styles.inlineButton]} onPress={() => dispatch({ type: 'choosePlayer' })}>
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
                style={[styles.card, styles.playerRow]}
                onPress={() => dispatch({ type: 'setupEventPlayer', player })}>
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
          onPress={() => dispatch({ type: 'scoreEvent', event: event })}>
          <Text style={styles.btnLabel}>STARTA RUNDA</Text>
        </TouchableOpacity>
      </View>
    )
  }
}
