import React, {Component} from "react";
import {Alert, AppState, View, Text, TouchableOpacity, StyleSheet, ListView, StatusBar} from "react-native";

import NavigationBar from 'react-native-navbar';
import ScoreRow from './ScoreRow';
import styles from '../../styles';
import realm from '../../realm';

import { fetchEventLeaderboard, deleteScoresFromServer } from '../../lib/ApiService';

export default class Scorecard extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { dataSource: ds.cloneWithRows([]) };
    this.refresh = this.refresh.bind(this);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
    this.cancelScoring = this.cancelScoring.bind(this);
    this.reallyCancelScoring = this.reallyCancelScoring.bind(this);
    this.saveScoring = this.saveScoring.bind(this);
    this.reallySaveScoring = this.reallySaveScoring.bind(this);
  }

  cancelScoring() {
    Alert.alert(
      'Avsluta rundan och radera allt du matat in?',
      'Är du riktigt säker?, riktigt riktigt säker?',
      [
        {text: 'NEJ, NEJ', onPress: () => console.log('Cancel'), style: 'cancel'},
        {text: 'JA, RADERA ALLT', onPress: () => this.reallyCancelScoring()},
      ]
    )
  }

  reallyCancelScoring() {
    const { event, navigator, sessionToken } = this.props;
    StatusBar.setNetworkActivityIndicatorVisible(true);

    let scoreIds = [];
    realm.write(() => {
      for (let player of event.eventPlayers) {
        for (let score of player.eventScores) {
          if(score.externalId !== null) {
            scoreIds.push(score.externalId);
          }
        }
        realm.delete(player.eventScores);
      }
      realm.delete(event.eventPlayers);
      event.isScoring = false;
      event.currentHole = 0;
      event.eventPlayers = [];
    });

    deleteScoresFromServer(event.id, scoreIds, sessionToken).then(() => {
      StatusBar.setNetworkActivityIndicatorVisible(false);
      requestAnimationFrame(() => navigator.resetTo({ tab: 'leaderboard' }));
    }).catch((error) => {
      StatusBar.setNetworkActivityIndicatorVisible(false);
      requestAnimationFrame(() => navigator.resetTo({ tab: 'leaderboard' }));
      console.log('opps, deleting went so so', error);
    });
  }

  saveScoring() {
    Alert.alert(
      'Avsluta rundan och Lämna scoreföringen?',
      'Stämmer alla siffror? På riktigt?',
      [
        {text: 'OJ, NEJ', onPress: () => console.log('Cancel'), style: 'cancel'},
        {text: 'JA, JAG ÄR KLAR', onPress: () => this.reallySaveScoring()},
      ]
    )
  }

  reallySaveScoring() {
    const { event, navigator } = this.props;
    realm.write(() => {
      event.isScoring = false;
      event.status = 'finished';
    });

    requestAnimationFrame(() => navigator.resetTo({ tab: 'leaderboard' }));
  }

  componentWillMount() {
    this.refresh();
  }

  componentDidMount() {
    AppState.addEventListener('change', this._handleAppStateChange);
    this.timer = setTimeout(() => {
      this.refresh();
    }, 60000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange(currentAppState) {
    if(currentAppState === 'active') {
      console.log('refreshing leaderboard via AppState');
      this.refresh();
    }
  }

  refresh() {
    console.log('refreshing');
    const { event } = this.props;
    StatusBar.setNetworkActivityIndicatorVisible(true);
    fetchEventLeaderboard(event.id, this.props.sessionToken).then((players) => {
      this.setLeaderboard(players);
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }).catch((error) => {
      StatusBar.setNetworkActivityIndicatorVisible(false);
      console.log('Error retreiving data', error);
    });
  }

  setLeaderboard(players) {
    const dataSource = this.state.dataSource.cloneWithRows(players);
    this.setState({dataSource});
  }

  render(){
    const { navigator, event } = this.props;
    const { dataSource } = this.state;

    const titleConfig = { title: 'Scorekort', tintColor: 'white'  };
    const lefButtonConfig = {
      title: '< Tillbaka',
      handler: () => requestAnimationFrame(() => navigator.pop()),
      tintColor: 'white'
    };

    let cancelBtn;
    if(event.isScoring) {
      cancelBtn = (
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.bottomBarBtn, styles.success]}
            onPress={this.saveScoring}>
              <Text style={styles.btnLabel}>SPARA & AVSLUTA</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.bottomBarBtn, styles.danger]}
            onPress={this.cancelScoring}>
              <Text style={styles.btnLabel}>RADERA SCORER</Text>
          </TouchableOpacity>
        </View>
      )
    }

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={lefButtonConfig} />

          <View style={s.scoreHeaderRow}>
            <Text style={s.scoreHeaderPos}>POS</Text>
            <Text style={s.scoreHeaderPlayer}>NAMN</Text>
            <Text style={s.scoreHeader}>🍺</Text>
            <Text style={s.scoreHeader}>KR</Text>
            <Text style={s.scoreHeader}>HÅL</Text>
            <Text style={s.scoreHeader}>{event.scoringType === 'points' ? 'POÄNG' : 'SLAG'}</Text>
          </View>

        <ListView
          enableEmptySections
          dataSource={dataSource}
          renderRow={
            (player) => <View style={s.listrow} key={`scorecard_player_row_${player.id}`}>
                          <View style={{flexDirection: 'row'}}>
                            <Text style={s.scoreHeaderPos}>{player.position}</Text>
                            <Text style={s.scoreHeaderPlayer}>{player.name.split(' ')[0]}</Text>
                            <Text style={s.scoreHeader}>{player.beers}</Text>
                            <Text style={s.scoreHeader}>{player.total_kr}</Text>
                            <Text style={s.scoreHeader}>{player.through}</Text>
                            <Text style={[s.scoreHeader, s.scorecardRowPoints]}>{player.total_points}</Text>
                          </View>
                        </View>
          }
        />

        {cancelBtn}
      </View>
    )
  }
}


const s = StyleSheet.create({
  scoreHeaderRow: {
    backgroundColor: '#eee',
    flexDirection: 'row',
    padding: 5,
  },

  listrow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#eee',
    padding: 5
  },

  scoreHeaderPos: {
    fontSize: 10,
    padding: 5,
    color: '#555',
    flex: 0.5,
    textAlign: 'left'
  },

  scoreHeader: {
    fontSize: 10,
    padding: 5,
    color: '#555',
    flex: 1,
    textAlign: 'center'
  },

  scoreHeaderPlayer: {
    fontSize: 12,
    padding: 5,
    color: '#555',
    flex: 1,
    textAlign: 'left'
  },

  scorecardRowPoints: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000'
  }
})
