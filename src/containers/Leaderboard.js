'use strict';
import React, {Component} from "react";
import {StatusBar, Text, TouchableOpacity, View, RefreshControl, ListView} from "react-native";

import NavigationBar from 'react-native-navbar';
import moment from 'moment';
import { connect } from 'react-redux';

import { logOutWithPrompt } from '../actions';
import { fetchPlayersIfNeeded } from '../actions/players';
import styles from '../styles';

import LeaderboardCard from '../components/LeaderboardCard';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = { dataSource: ds.cloneWithRows(props.players.data) }
    this.reloadLeaderboard = this.reloadLeaderboard.bind(this);
    this.reloadLeaderboard();
  }

  reloadLeaderboard() {
    this.props.doFetch();
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.players.data !== this.props.players.data) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.players.data)
      })
    }
  }


  render() {
    const { navigator, players, onLogout, currentUserId, scoringEvent } = this.props;

    const titleConfig = { title: 'Tisdagsgolfen', tintColor: 'white' };
    const leftButtonConfig = {
      title: 'Logga ut',
      handler: () => onLogout(),
      tintColor: 'white'
    };

    let eventBanner;
    if(scoringEvent && scoringEvent.id) {
      eventBanner = (
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigator.resetTo({ scoreEvent: 1, event: scoringEvent })}>
          <Text style={styles.btnLabel}>ÅTERUPPTA SCOREFÖRING</Text>
        </TouchableOpacity>
      );
    }

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          title={titleConfig}
          leftButton={leftButtonConfig} />

          {eventBanner}

          <ListView
            enableEmptySections={true}
            initialListSize={8}
            dataSource={this.state.dataSource}
            refreshControl={
              <RefreshControl
                refreshing={players.isFetching}
                onRefresh={this.reloadLeaderboard}
                tintColor="#477dca"
                title="Uppdaterar..."
                titleColor="#477dca"
                progressBackgroundColor="#FF2179"
              />
            }
            renderRow={(rowData) => <LeaderboardCard currentUserId={currentUserId} data={rowData} />}
          />
      </View>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    players: state.players,
    currentUserId: state.auth.user.id,
    scoringEvent: state.event.event
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    doFetch: () => {
      dispatch(fetchPlayersIfNeeded())
    },
    onLogout: () => {
      dispatch(logOutWithPrompt())
    }
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Leaderboard)
