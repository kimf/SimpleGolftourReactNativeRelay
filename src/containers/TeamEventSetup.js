'use strict';

import React, {Component} from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import NavigationBar from 'react-native-navbar';

import { connect } from 'react-redux';

import { abortEventSetup, addEventTeam } from '../actions/event';
import styles from '../styles';

class TeamEventSetup extends Component {
  componentWillMount() {
    this.goPlay = this._goPlay.bind(this);
    this.abort = this._abort.bind(this);
    this.addEventTeam = this._addTeamEvent.bind(this);
  }

  _goPlay() {
    const { event, navigator } = this.props;
    requestAnimationFrame(() => navigator.resetTo({ scoreEvent: 1, event: event }) );
  }

  _abort() {
    this.props.navigator.resetTo({ tab: 'events' })
    this.props.abortEventSetup();
  }

  _addTeamEvent(event) {
    this.props.addEventTeam(event)
  }

  render() {
    const { event, playing, navigator } = this.props;
    const titleConfig = { title: 'Scora', tintColor: 'white'  };
    const leftButtonConfig = {
      title: 'Avbryt',
      handler: () => this.abort(),
      tintColor: 'white'
    };

    const newTeam = (
      <View style={[styles.listrow, {flex: 1, borderBottomWidth: 0}]}>
        <TouchableOpacity
          style={styles.addPlayerButton}
          onPress={() => this.addEventTeam()}>
          <Text style={[styles.centerText, {color: '#fff'}]}>LÄGG TILL NYTT LAG</Text>
        </TouchableOpacity>
      </View>
    );

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#0091e5'}}
          leftButton={leftButtonConfig}
        />

        <View style={styles.inlineHeader}>
          <Text style={styles.centerText}>Sätt up de lag du för score för?</Text>
        </View>

        <ScrollView>
          {playing.map((team, index) => {
            return (
              <View key={`setup_team_row_${index}`}>
                <TouchableOpacity
                  style={styles.listrow}
                  onPress={() => requestAnimationFrame(() => navigator.push({ setupEventTeam: 1, teamIndex: index, event }))}>

                  <View style={styles.flexOne}>
                    <Text style={[styles.flexOne, {fontWeight: 'bold', fontFamily: 'Avenir', fontSize: 16, paddingTop: 5, paddingBottom: 5}]}>
                      {`Lag ${index+1}`}
                    </Text>
                    {team.players.map((player, index) => {
                      return(
                        <Text key={`team_event_player_${player.id}`} style={[styles.flexOne, {fontFamily: 'Avenir', paddingTop: 5, fontSize: 12}]}>
                          {player.name}
                        </Text>
                      )
                    })}
                  </View>
                  <Text style={styles.strokeInfo}>Extraslag: {team.strokes}</Text>
                </TouchableOpacity>
                <View style={[styles.listrow, {flex: 1, borderBottomWidth: 0}]}>
                  <TouchableOpacity
                    style={{margin: 5, padding: 5, backgroundColor: '#eee'}}
                    onPress={() => requestAnimationFrame(() => navigator.push({selectPlayer: 1, teamIndex: index, event}))}>
                    <Text style={[styles.centerText, {fontSize: 12, fontFamily: 'Avenir', color: '#222'}]}>LÄGG TILL SPELARE I LAG {index + 1}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}

          {newTeam}
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

const mapStateToProps = (state) => {
  return {
    event: state.event.event,
    playing: state.event.playing,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    abortEventSetup: () => {
      dispatch(abortEventSetup())
    },
    addEventTeam: (event) => {
      dispatch(addEventTeam(event))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TeamEventSetup)
