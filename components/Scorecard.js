import React, {Component} from "react";
import {Alert, View, Text, TouchableOpacity} from "react-native";

import NavigationBar from 'react-native-navbar';

import styles from '../styles';
import realm from '../realm';

export default class Scorecard extends Component {
  constructor(props) {
    super(props);
    this.cancelScoring = this.cancelScoring.bind(this);
  }

  cancelScoring() {
    const { event, dispatch } = this.props;
    Alert.alert(
      'Avsluta rundan?',
      'Är du riktigt säker?',
      [
        {text: 'NEJ', onPress: () => console.log('Cancel'), style: 'cancel'},
        {text: 'JARÅ', onPress: () => dispatch({type: 'cancelScoring', event: event})},
      ]
    )
  }

  render() {
    const { event, closeScorecard } = this.props;
    const titleConfig = { title: 'Scorekort', tintColor: 'white'  };
    const leftButtonConfig = {
      title: '< Tillbaka',
      handler: () => closeScorecard(),
      tintColor: 'white'
    };

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={this.cancelScoring}>
          <Text style={styles.btnLabel}>AVSLUTA RUNDA</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
