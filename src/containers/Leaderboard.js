'use strict';
import React, {Component} from "react";
import {StatusBar, Text, TouchableOpacity, View, RefreshControl, ListView} from "react-native";

import NavigationBar from 'react-native-navbar';
import moment from 'moment';
import { connect } from 'react-redux';

import { changeTab, logOutWithPrompt } from '../actions';
import styles from '../styles';

import LeaderboardCard from '../components/LeaderboardCard';

class Leaderboard extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { refreshing: false, dataSource: ds.cloneWithRows([]) };
    this.reloadLeaderboard = this.reloadLeaderboard.bind(this);
  }

  componentWillMount() {
    let players = [] //realm.objects('Player').filtered('eventCount >= 1').sorted('position');
    const scoringEvent = {} // realm.objects('Event').find(event => event.isScoring);
    this.setDataState(players, scoringEvent);
  }

  reloadLeaderboard(){

  }

  // reloadLeaderboard(players, setState = true) {
  //   if(setState) {
  //     this.setState({refreshing: true});
  //   }

  //   StatusBar.setNetworkActivityIndicatorVisible(true);
  //   fetchPlayers(this.props.sessionToken).then((players) => {
  //     this.setDataState(players);
  //     StatusBar.setNetworkActivityIndicatorVisible(false);
  //   }).catch((error) => {
  //     this.setState({refreshing: false});
  //     StatusBar.setNetworkActivityIndicatorVisible(false);
  //     console.log('Error retreiving data', error);
  //   });
  // }

  setDataState(players, scoringEvent) {
    const dataSource = this.state.dataSource.cloneWithRows(players);
    this.setState({refreshing: false, dataSource, scoringEvent});
  }

  render() {
    const { navigator, onLogout } = this.props;
    const { dataSource, scoringEvent, refreshing } = this.state;

    const titleConfig = { title: 'Tisdagsgolfen', tintColor: 'white' };
    const rightButtonConfig = {
      title: 'Logga ut',
      handler: () => onLogout(),
      tintColor: 'white'
    };

    let eventBanner;
    if(scoringEvent) {
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
          rightButton={rightButtonConfig} />

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


const mapStateToProps = (state) => {
  return {
    user: state.auth.user
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    onLogout: () => {
      dispatch(logOutWithPrompt())
    }
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Leaderboard)
