import React, {
  AsyncStorage,
  Component,
  View,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import ScorecardPlayerRow from './ScorecardPlayerRow';

import styles from '../styles';

export default class ScoreEvent extends Component {
  constructor(props) {
    super(props);

    console.log(props);

    const hole = {
      par: Math.floor(Math.random()*(6-3+1)+3),
      nr: props.hole === undefined ? 1 : props.hole.nr
    }

    this.state = {isScoring: false, hole: hole, players: []}

    this._showScoreForm = this._showScoreForm.bind(this);
    this._closeScoreForm = this._closeScoreForm.bind(this);
    this._setPlayerData = this._setPlayerData.bind(this);
  }

  componentWillMount() {
    const { hole } = this.state;
    let currentPlayers = [];

    realm.objects('Event').filtered('make = "Honda"');
    AsyncStorage.getItem('holeScoringData', (err, result) => {
      let holeScoringData = JSON.parse(result);
      const playerData = holeScoringData[hole.nr - 1]

      if(playerData !== undefined){
        currentPlayers = playerData
      } else {
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
      }

      this.setState({
        players: currentPlayers
      });
    });
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
    const isScoring = false;
    this._saveAway(players);
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

    realm.write(() => {

    });
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

        {players.map((player) => {
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
