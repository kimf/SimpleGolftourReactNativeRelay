import React, {Component} from "react";
import {Alert, AppState, View, Text, TouchableOpacity, StyleSheet} from "react-native";

import NavigationBar from 'react-native-navbar';
import ScoreRow from '../components/Scoring/ScoreRow';
import styles from '../styles';

import { connect } from 'react-redux';
import { saveScoring, cancelScoring } from '../actions/event';
import { refreshScorecard } from '../actions/scorecard';

class Scorecard extends Component {
  constructor(props) {
    super(props);

    this.refresh = this._refresh.bind(this);
    this.handleAppStateChange = this._handleAppStateChange.bind(this);
    this.cancelScoring = this._cancelScoring.bind(this);
    this.reallyCancelScoring = this._reallyCancelScoring.bind(this);
    this.saveScoring = this._saveScoring.bind(this);
    this.reallySaveScoring = this._reallySaveScoring.bind(this);
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
    this.props.saveScoring(this.props.event.id);
    requestAnimationFrame(() => this.props.navigator.resetTo({ tab: 'leaderboard' }));
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
    this.timer = setTimeout(() => {
      this.refresh();
    }, 60000);
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  render(){
    const { navigator, event, players } = this.props;

    const titleConfig = { title: 'Scorekort', tintColor: 'white'  };
    const lefButtonConfig = {
      title: '< Tillbaka',
      handler: () => requestAnimationFrame(() => navigator.pop()),
      tintColor: 'white'
    };

    let cancelBtn;
    if(event) {
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
            <Text style={s.scoreHeader}>SLAG</Text>
            <Text style={s.scoreHeader}>{event.scoring_type === 'strokes' ? 'NETTO' : 'POÄNG'}</Text>
          </View>

        {players.map(player => {
          return (
            <View style={s.listrow} key={`scorecard_player_row_${player.id}`}>
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
        })}
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


const mapStateToProps = (state) => {
  return {
    event: state.event.event,
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
)(Scorecard)
