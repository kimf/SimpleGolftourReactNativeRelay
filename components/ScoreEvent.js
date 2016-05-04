import React, {
  AsyncStorage,
  Component,
  View,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import ScorecardPlayerRow from './ScorecardPlayerRow';

const styles = require('../styles.js');

export default class ScoreEvent extends Component {
  constructor(props) {
    super(props);

    const hole = {
      par: Math.floor(Math.random()*(6-3+1)+3),
      nr: props.hole === undefined ? 1 : props.hole.nr
    }

    AsyncStorage.getItem('userData', (err, result) => {
      let userData = JSON.parse(result);
      AsyncStorage.setItem('userData', JSON.stringify({ email: userData.email }));
      this.setState({
        component: 'Login',
        onLogin: this.onLogin,
        userData: userData
      });
    });


    const currentPlayers = []
    for (let player of props.currentUser.leaderboard) {
      if(props.players.indexOf(player.id) !== -1) {
        currentPlayers.push({
          id: player.id,
          name: player.name,
          isScoring: false,
          holeData: {
            strokes: hole.par,
            putts: 2,
            beers: 0,
            isScored: false
          }
        });
      }
    }

    this.state = {
      players: currentPlayers,
      hole: hole,
      isScoring: false
    };

    this._showScoreForm = this._showScoreForm.bind(this);
    this._closeScoreForm = this._closeScoreForm.bind(this);
    this._setPlayerData = this._setPlayerData.bind(this);
  }

  _showScoreForm(playerId) {
    const players = [];
    for (let player of this.state.players) {
      if(player.id === playerId) {
        player.isScoring = true;
      }
      players.push(player);
    }
    const isScoring = true
    this.setState({players, isScoring});
  }

  _closeScoreForm(playerId) {
    const players = [];
    for (let player of this.state.players) {
      if(player.id === playerId) {
        player.isScoring = false;
        player.holeData.isScored = true;
      }
      players.push(player);
    }
    const isScoring = false
    this.setState({players, isScoring});
  }

  _setPlayerData(value, playerId, dataType) {
    const players = [];
    for (let player of this.state.players) {
      if(player.id === playerId) {
        if(dataType === 'strokes') {
          player.holeData.strokes = value;
        }

        if(dataType === 'putts') {
           player.holeData.putts = value;
        }

        if(dataType === 'beers') {
           player.holeData.beers = value;
        }

        player.holeData.isScored = true;
      }
      players.push(player);
    }

    this._saveAway(players);
    this.setState({players});
  }

  _saveAway(playerData) {
    const { hole } = this.state;
    const holeSummaries = []
    holeSummaries[hole.nr - 1] = playerData;
    AsyncStorage.setItem('holeScoringData', JSON.stringify(holeSummaries));
  }

  render() {
    const { currentUser, event } = this.props;
    const { players, hole } = this.state;

    const titleConfig = { title: `Hål ${hole.nr}`, tintColor: 'white'  };

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
        />

        {this.state.players.map((player) => {
          return(
            <ScorecardPlayerRow
              player={player}
              setPlayerData={this._setPlayerData}
              showScoreForm={this._showScoreForm}
              closeScoreForm={this._closeScoreForm}
              hole={hole}
              key={`player_scorecard_row_${player.id}`}
            />
          )
        })}
      </View>
    );
  }
}
