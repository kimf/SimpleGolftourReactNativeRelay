'use strict';

import React, {Component} from "react";
import {Alert, Text, TextInput, TouchableOpacity, ListView, View} from "react-native";
import NavigationBar from 'react-native-navbar';

import { connect } from 'react-redux';

import { addPlayerToEvent, changePlayerStrokes } from '../actions/event';

import styles from '../styles';

class EventPlayerSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {strokes: (props.player.strokes || 0) };
  }

  confirm() {
    const { event, player, navigator, addPlayerToEvent, changePlayerStrokes } = this.props;
    const strokes = parseInt(this.state.strokes);

    if(strokes < 37) {
      if(player.strokes === undefined) {
        this.props.addPlayerToEvent(player, strokes);
      } else {
        this.props.changePlayerStrokes(player, strokes);
      }
      requestAnimationFrame(() => navigator.resetTo({ setupEvent: 1, event: event }));
    } else {
      Alert.alert('MAX 36 SLAG, SÅ DÅLIG ÄR HEN NOG INTE!');
    }
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
          statusBar={{style: 'light-content', tintColor: '#0091e5'}}
          leftButton={leftButtonConfig}
          rightButton={rightButtonConfig}
        />


        <View style={styles.listrow} key={`hcp_row_for_player_${player.id}`}>
          <View style={styles.cardTitle}>
            <Text style={styles.label}>Hur många extra-slag har {player.name}?</Text>
            <Text style={styles.label}>Max 36!</Text>
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


const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    addPlayerToEvent: (player, strokes) => {
      dispatch(addPlayerToEvent(player, strokes))
    },
    changePlayerStrokes: (player, strokes) => {
      dispatch(changePlayerStrokes(player, strokes))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventPlayerSetup)
