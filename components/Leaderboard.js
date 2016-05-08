'use strict';

import React, {Component} from "react";
import {AsyncStorage, Text, TouchableOpacity, View} from "react-native";

import styles from '../styles';
import realm from '../realm';
import { ListView } from 'realm/react-native';

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import { apiUrl } from '../lib/ApiService';

import LeaderboardCard from './LeaderboardCard';
import Loading from './Loading';

export default class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.onLogout = this.props.onLogout;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { dataSource: ds.cloneWithRows([]) };
  }

  componentWillMount() {
    let players = realm.objects('Player').sorted('position');
    this.setPlayers(players, true);

    if(players.length < 1) {
      this.reloadLeaderboard(players);
    }
  }

  reloadLeaderboard(players) {
    fetch(apiUrl + '/leaderboard', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${this.props.sessionToken}`
      }
    })
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      json.map((player) => {
        realm.write(() => {
          realm.create('Player', {
            id: player.id,
            name: player.name,
            position: player.position,
            eventCount: player.num_events,
            average: player.average,
            totalPoints: parseFloat(player.total_points),
            prevPos: player.prev_position,
            points: player.points_array.toString()
          }, true);
        });
      });

      this.setPlayers(players, false);
    }).catch((error) => {
      this.setState({loading: 'false'});
      console.log('Error retreiving data', error);
    })
  }

  setPlayers(players, loading) {
    const dataSource = this.state.dataSource.cloneWithRows(players);
    this.setState({dataSource, loading});
  }

  render() {
    const { dispatch } = this.props;
    const { dataSource } = this.state;

    const titleConfig = { title: 'Tisdagsgolfen', tintColor: 'white' };
    const leftButton = (
        <Icon
          style={[styles.headerBtn, styles.leftBtn]}
          name="person"
          size={20}
          onPress={() => dispatch({ type: 'openProfile' })}
        />
    );
    const rightButton = (
      <Icon
        style={[styles.headerBtn, styles.rightBtn]}
        name="calendar"
        size={20}
        onPress={() => dispatch({ type: 'openEvents' })}
      />
    );

    let eventBanner;
    // const todayEvents = currentUser.current_season_events.filter((event) =>
    //   event.status === 'planned' && moment(event.starts_at).isSame(Date.now(), 'day')
    // );
    // if(todayEvents.length > 0) {
    //   eventBanner = (
    //     <TouchableOpacity
    //       style={styles.btn}
    //       onPress={() => dispatch({ type: 'selectPlayers', event: todayEvents[0] })}>
    //       <Text style={styles.btnLabel}>RUNDA IDAG - SCORA NU</Text>
    //     </TouchableOpacity>
    //   );
    // }

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          title={titleConfig}
          leftButton={leftButton}
          rightButton={rightButton} />

          <ListView
            enableEmptySections
            dataSource={dataSource}
            renderRow={(rowData) => <LeaderboardCard data={rowData} />}
          />

          {eventBanner}
      </View>
    )
  }
}
