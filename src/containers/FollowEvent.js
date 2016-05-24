import React, {Component} from "react";
import {Alert, AppState, View, Text, TouchableOpacity, StyleSheet} from "react-native";

import NavigationBar from 'react-native-navbar';
import ScoreRow from '../components/Scoring/ScoreRow';
import styles from '../styles';

import { connect } from 'react-redux';
import { saveScoring, cancelScoring } from '../actions/event';
import { refreshScorecard } from '../actions/scorecard';

const timer = null;

class FollowEvent extends Component {
  constructor(props) {
    super(props);

    this.refresh = this._refresh.bind(this);
    this.handleAppStateChange = this._handleAppStateChange.bind(this);
    this.cancelScoring = this._cancelScoring.bind(this);
    this.reallyCancelScoring = this._reallyCancelScoring.bind(this);
    this.saveScoring = this._saveScoring.bind(this);
    this.reallySaveScoring = this._reallySaveScoring.bind(this);
    this.timer = this._timer.bind(this);
  }

  _cancelScoring() {
    Alert.alert(
      'Avsluta rundan och radera allt du matat in?',
      'Är du riktigt säker?, riktigt riktigt säker?',
      [
        {text: 'NEJ, NEJ', onPress: () => console.log('Cancel'), style: 'cancel'},
        {text: 'JA, RADERA ALLT', onPress: () => this.reallyCancelScoring()},
      ]
    )
  }

  _reallyCancelScoring() {
    this.props.cancelScoring(this.props.event.id);
    requestAnimationFrame(() => this.props.navigator.resetTo({ tab: 'leaderboard' }));
  }

  _saveScoring() {
    Alert.alert(
      'Avsluta rundan och Lämna scoreföringen?',
      'Stämmer alla siffror? På riktigt?',
      [
        {text: 'OJ, NEJ', onPress: () => console.log('Cancel'), style: 'cancel'},
        {text: 'JA, JAG ÄR KLAR', onPress: () => this.reallySaveScoring()},
      ]
    )
  }

  _reallySaveScoring() {
    this.props.navigator.resetTo({ tab: 'leaderboard' });
    this.props.saveScoring(this.props.event.id);
  }

  _handleAppStateChange(currentAppState) {
    if(currentAppState === 'active') {
      console.log('refreshing leaderboard via AppState');
      this.refresh();
    }
  }

  _refresh() {
    this.props.refreshScorecard(this.props.event.id);
  }

  componentWillMount() {
    this.refresh();
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
    this.timer();
  }

  componentWillUnmount() {
    clearTimeout(timer);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  _timer() {
    timer = setTimeout(() => {
      console.log('refreshing via setTimeout')
      this.refresh();
      this.timer();
    }, 6000);
  }

  individualRow(player, index) {
    return (
      <View style={s.listrow} key={`scorecard_player_row_${index}`}>
        <View style={{flexDirection: 'row'}}>
          <Text style={s.scoreHeaderPos}>{player.position}</Text>
          <Text style={s.scoreHeaderPlayer}>{player.name.split(' ')[0]}</Text>
          <Text style={s.scoreHeader}>{player.beers}</Text>
          <Text style={s.scoreHeader}>{player.total_kr}</Text>
          <Text style={s.scoreHeader}>{player.through}</Text>
          <Text style={s.scoreHeader}>{player.total_strokes}</Text>
          <Text style={[s.scoreHeader, s.scorecardRowPoints]}>{player.total_points}</Text>
        </View>
      </View>
    )
  }

  teamEventRow(team, index) {
    return (
      <View style={s.listrow} key={`scorecard_player_row_${index}`}>
        <View style={{flexDirection: 'row'}}>
          <Text style={s.scoreHeaderPos}>{team.position}</Text>
          <Text style={s.scoreHeaderPlayer}>{team.name}</Text>
          <Text style={s.scoreHeader}>{team.through}</Text>
          <Text style={s.scoreHeader}>{team.total_strokes}</Text>
          <Text style={[s.scoreHeader, s.scorecardRowPoints]}>{team.total_points}</Text>
        </View>
      </View>
    )
  }

  render(){
    const { navigator, event, players } = this.props;
    if(!event) {
      return null;
    }

    const beerHeader = event.team_event ? null : (
      <Text style={s.scoreHeader}>🍺</Text>
    )

    const krHeader = event.team_event ? null : (
      <Text style={s.scoreHeader}>KR</Text>
    )


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
          statusBar={{style: 'light-content', tintColor: '#0091e5'}}
          leftButton={lefButtonConfig} />

          <View style={s.scoreHeaderRow}>
            <Text style={s.scoreHeaderPos}>POS</Text>
            <Text style={s.scoreHeaderPlayer}>NAMN</Text>
            {beerHeader}
            {krHeader}
            <Text style={s.scoreHeader}>HÅL</Text>
            <Text style={s.scoreHeader}>SLAG</Text>
            <Text style={s.scoreHeader}>{event.scoring_type === 'strokes' ? 'NETTO' : 'POÄNG'}</Text>
          </View>

        {players.map((player, index) => {
          return event.team_event ? this.teamEventRow(player, index) : this.individualRow(player, index)
        })}
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


const mapStateToProps = (state) => {
  return {
    players: state.scorecard.players
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    cancelScoring: (eventId) => {
      dispatch(cancelScoring(eventId))
    },
    saveScoring: (eventId) => {
      dispatch(saveScoring(eventId))
    },
    refreshScorecard: (eventId) => {
      dispatch(refreshScorecard(eventId))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FollowEvent)
