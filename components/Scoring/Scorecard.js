import React, {Component} from "react";
import {AppState, View, Text, TouchableOpacity, StyleSheet, ListView, StatusBar} from "react-native";

import NavigationBar from 'react-native-navbar';
import ScoreRow from './ScoreRow';
import styles from '../../styles';

import { fetchEventLeaderboard } from '../../lib/ApiService';

export default class Scorecard extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { dataSource: ds.cloneWithRows([]) };
    this.refresh = this.refresh.bind(this);
    this._handleAppStateChange = this._handleAppStateChange.bind(this);
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
    const { navigator } = this.props;
    const { dataSource } = this.state;

    const titleConfig = { title: 'Scorekort', tintColor: 'white'  };
    const lefButtonConfig = {
      title: '< Tillbaka',
      handler: () => requestAnimationFrame(() => navigator.pop()),
      tintColor: 'white'
    };

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
            <Text style={s.scoreHeader}>HÅL</Text>
            <Text style={s.scoreHeader}>POÄNG</Text>
            <Text style={s.scoreHeader}>KR</Text>
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
                            <Text style={s.scoreHeader}>{player.through}</Text>
                            <Text style={[s.scoreHeader, s.scorecardRowPoints]}>{player.total_points}</Text>
                            <Text style={s.scoreHeader}>{player.total_kr}</Text>
                          </View>
                        </View>
          }
        />
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
