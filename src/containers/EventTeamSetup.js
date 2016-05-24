'use strict';

import React, {Component} from "react";
import {Alert, Text, TextInput, TouchableOpacity, ListView, View} from "react-native";
import NavigationBar from 'react-native-navbar';

import { connect } from 'react-redux';

import { changeTeamStrokes } from '../actions/event';

import styles from '../styles';

class EventTeamSetup extends Component {
  constructor(props) {
    super(props);
    this.state = {strokes: (props.playing[props.teamIndex].strokes || 0) };
  }

  confirm() {
    const { event, teamIndex, navigator, changeTeamStrokes } = this.props;
    const strokes = parseInt(this.state.strokes);

    if(strokes < 37) {
      changeTeamStrokes(teamIndex, strokes);
      requestAnimationFrame(() => navigator.resetTo({ setupTeamEvent: 1, event: event }));
    } else {
      Alert.alert('MAX 36 SLAG, SÅ DÅLIGA ÄR DOM NOG INTE!');
    }
  }

  render() {
    const { team, teamIndex, navigator } = this.props;
    const { strokes } = this.state;

    const titleConfig = { title: `SpelHCP - Lag ${teamIndex+1}`, tintColor: 'white'  };
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


        <View style={styles.listrow} key={`hcp_row_for_event_team_${teamIndex}`}>
          <View style={styles.cardTitle}>
            <Text style={styles.label}>Hur många extra-slag har Lag {teamIndex+1}?</Text>
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
  return {
    playing: state.event.playing,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    changeTeamStrokes: (teamIndex, strokes) => {
      dispatch(changeTeamStrokes(teamIndex, strokes))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EventTeamSetup)
