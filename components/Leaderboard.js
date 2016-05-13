'use strict';

import React, {Component} from "react";
import {StatusBar, Text, TouchableOpacity, View} from "react-native";

import styles from '../styles';
import realm from '../realm';
import { ListView } from 'realm/react-native';

import NavigationBar from 'react-native-navbar';
import moment from 'moment';

import { fetchPlayers } from '../lib/ApiService';

import LeaderboardCard from './LeaderboardCard';
import Loading from './shared/Loading';

export default class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.onLogout = this.props.onLogout;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { dataSource: ds.cloneWithRows([]) };
  }

  componentWillMount() {
    let players = realm.objects('Player').filtered('eventCount > 1').sorted('position');
    const scoringEvent = realm.objects('Event').find(event => event.isScoring);
    this.setDataState(players, scoringEvent);
    this.reloadLeaderboard(players);
  }

  reloadLeaderboard(players) {
    StatusBar.setNetworkActivityIndicatorVisible(true);
    fetchPlayers(this.props.sessionToken).then((players) => {
      this.setDataState(players);
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }).catch((error) => {
      StatusBar.setNetworkActivityIndicatorVisible(false);
      console.log('Error retreiving data', error);
    });
  }

  setDataState(players, scoringEvent) {
    const dataSource = this.state.dataSource.cloneWithRows(players);
    this.setState({dataSource, scoringEvent});
  }

  render() {
    const { navigator } = this.props;
    const { dataSource, scoringEvent } = this.state;

    const titleConfig = { title: 'Tisdagsgolfen', tintColor: 'white' };

    let eventBanner;
    if(scoringEvent) {
      eventBanner = (
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigator.push({ scoreEvent: 1, event: scoringEvent })}>
          <Text style={styles.btnLabel}>ÅTERUPPTA SCOREFÖRING</Text>
        </TouchableOpacity>
      );
    }

    let leaderboard;
    if(dataSource.rowIdentities[0].length === 0) {
      leaderboard = (
        <Text style={{flex: 1, padding: 40, fontWeight: 'bold', fontSize: 20, textAlign: 'center'}}>
          INGA RUNDOR SPELADE
        </Text>
      );
    } else {
      leaderboard = (
        <ListView
          enableEmptySections
          dataSource={dataSource}
          renderRow={(rowData) => <LeaderboardCard data={rowData} />}
        />
      );
    }

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          title={titleConfig}/>

          {eventBanner}
          {leaderboard}
      </View>
    )
  }
}
