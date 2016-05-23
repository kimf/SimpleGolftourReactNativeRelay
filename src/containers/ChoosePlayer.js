'use strict';

import React, { Component } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import NavigationBar from 'react-native-navbar';

import { connect } from 'react-redux';

import styles from '../styles';

class ChoosePlayer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { event, navigator, players, selectedPlayers } = this.props;

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
          statusBar={{style: 'light-content', tintColor: '#0091e5'}}
          leftButton={leftButtonConfig}
        />
        <ScrollView>
          {players.map((player) => {
            if(selectedPlayers.find((p) => p.id === player.id)){
              return null
            }

            return (
              <TouchableOpacity
                key={`choose_player_row_${player.id}`}
                style={styles.listrow}
                onPress={() => requestAnimationFrame(() => navigator.push({ setupEventPlayer: 1, player, event }))}>
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


const mapStateToProps = (state) => {
  return {
    players: state.players.data.slice(0).sort((a, b) => a.name - b.name),
    selectedPlayers: state.event.playing
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChoosePlayer)
