'use strict';

import React, { Component } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import SearchBar from 'react-native-search-bar';

import NavigationBar from 'react-native-navbar';

import { connect } from 'react-redux';
import { addEventPlayer } from '../actions/event';
import styles from '../styles';

class ChoosePlayer extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.findInselectedPlayers = this._findInselectedPlayers.bind(this)
    this.selectPlayer = this._selectPlayer.bind(this)
    this.search = this._search.bind(this);
    this.cancelsearch = this._cancelSearch.bind(this);
  }

  _findInselectedPlayers(player) {
    const { event, selectedPlayers } = this.props;
    if(event.team_event) {
      for(let team of selectedPlayers) {
        if(team.players.find(p => p.id === player.id) !== undefined){
          return true;
        }
      }
    } else {
      return selectedPlayers.find((p) => p.id === player.id) !== undefined;
    }
  }

  _selectPlayer(player) {
    const { event, teamIndex, navigator } = this.props;
    if(event.team_event) {
      this.props.addEventPlayer(player, teamIndex, event);
      requestAnimationFrame(() => navigator.pop());
    } else {
      requestAnimationFrame(() => navigator.push({ setupEventPlayer: 1, player, event }))
    }
  }

  componentDidMount() {
    this.refs.searchBar.focus()
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
        <SearchBar
          ref='searchBar'
          placeholder='Sök spelare...'
          onChangeText={this.search}
          onSearchButtonPress={this.search}
          onCancelButtonPress={this.cancelsearch}
        />
        <ScrollView>
          {players.map((player) => {
            if(this.findInselectedPlayers(player)){
              return null;
            }

            return (
              <TouchableOpacity
                key={`choose_player_row_${player.id}`}
                style={styles.listrow}
                onPress={() => this.selectPlayer(player) }>
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
  return {
    addEventPlayer: (player, teamIndex, event) => {
      dispatch(addEventPlayer(player, teamIndex, event));
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChoosePlayer)
