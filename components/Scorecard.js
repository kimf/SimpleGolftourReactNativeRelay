import React, {Component} from "react";
import {View, Text} from "react-native";

import NavigationBar from 'react-native-navbar';

import styles from '../styles';
import realm from '../realm';

export default class Scorecard extends Component {
  constructor(props) {
    super(props);
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
      </View>
    );
  }
}
