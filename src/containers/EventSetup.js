'use strict';

import React, {Component} from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import NavigationBar from 'react-native-navbar';

import { connect } from 'react-redux';

import { abortEventSetup } from '../actions/event';
import styles from '../styles';

class EventSetup extends Component {
  componentWillMount() {
    this.goPlay = this._goPlay.bind(this);
    this.abort = this._abort.bind(this);
  }

  _goPlay() {
    const { event, navigator } = this.props;
    requestAnimationFrame(() => navigator.resetTo({ scoreEvent: 1, event: event }) );
  }

  _abort() {
    this.props.navigator.resetTo({ tab: 'events' })
    this.props.abortEventSetup();
  }

  render() {
    const { event, playing, navigator } = this.props;
    const titleConfig = { title: 'Scora', tintColor: 'white'  };
    const leftButtonConfig = {
      title: 'Avbryt',
      handler: () => this.abort(),
      tintColor: 'white'
    };

    const newPlayer = (
      <View style={[styles.listrow, {flex: 1, borderBottomWidth: 0}]}>
        <TouchableOpacity
          style={styles.addPlayerButton}
          onPress={() => requestAnimationFrame(() => navigator.push({selectPlayer: 1, event: event}))}>
          <Text style={[styles.centerText, {color: '#fff'}]}>LÄGG TILL SPELARE</Text>
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
          <Text style={styles.centerText}>Vilka spelare för du score för?</Text>
        </View>

        <ScrollView>
          {playing.map((player) => {
            return (
              <TouchableOpacity
                key={`setup_player_row_${player.id}`}
                style={styles.listrow}
                onPress={() => requestAnimationFrame(() => navigator.push({ setupEventPlayer: 1, player, event }))}>
                <Text style={[styles.flexOne]}>
                  {player.name}
                </Text>
                <Text style={styles.strokeInfo}>Extraslag: {player.strokes}</Text>
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
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventSetup)
