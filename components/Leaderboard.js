'use strict';

import React, {Component} from "react";
import {StatusBar, Text, TouchableOpacity, View, RefreshControl} from "react-native";

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
    this.state = { refreshing: false, dataSource: ds.cloneWithRows([]) };
    this.reloadLeaderboard = this.reloadLeaderboard.bind(this);
  }

  componentWillMount() {
    let players = realm.objects('Player').filtered('eventCount >= 1').sorted('position');
    const scoringEvent = realm.objects('Event').find(event => event.isScoring);
    this.setDataState(players, scoringEvent);
    this.reloadLeaderboard(players, false);
  }

  reloadLeaderboard(players, setState = true) {
    if(setState) {
      this.setState({refreshing: true});
    }

    StatusBar.setNetworkActivityIndicatorVisible(true);
    fetchPlayers(this.props.sessionToken).then((players) => {
      this.setDataState(players);
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }).catch((error) => {
      this.setState({refreshing: false});
      StatusBar.setNetworkActivityIndicatorVisible(false);
      console.log('Error retreiving data', error);
    });
  }

  setDataState(players, scoringEvent) {
    const dataSource = this.state.dataSource.cloneWithRows(players);
    this.setState({refreshing: false, dataSource, scoringEvent});
  }

  render() {
    const { navigator } = this.props;
    const { dataSource, scoringEvent, refreshing } = this.state;

    const titleConfig = { title: 'Tisdagsgolfen', tintColor: 'white' };

    let eventBanner;
    if(scoringEvent) {
      eventBanner = (
        <TouchableOpacity
          style={styles.btn}
          onPress={() => requestAnimationFrame(() => navigator.resetTo({ scoreEvent: 1, event: scoringEvent }))}>
          <Text style={styles.btnLabel}>ÅTERUPPTA SCOREFÖRING</Text>
        </TouchableOpacity>
      );
    }

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          title={titleConfig}/>

          {eventBanner}

          <ListView
            enableEmptySections
            dataSource={dataSource}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={this.reloadLeaderboard}
                tintColor="#477dca"
                title="Uppdaterar..."
                titleColor="#477dca"
                progressBackgroundColor="#FF2179"
              />
            }
            renderRow={(rowData) => <LeaderboardCard data={rowData} />}
          />
      </View>
    )
  }
}
