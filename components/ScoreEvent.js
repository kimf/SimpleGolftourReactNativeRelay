import React, {
  AsyncStorage,
  Component,
  View,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import ScorecardPlayerRow from './ScorecardPlayerRow';

import styles from '../styles';
import realm from '../realm';

export default class ScoreEvent extends Component {
  constructor(props) {
    super(props);

    const currentHoleNr = props.event.currentHole;

    console.log(props.event);

    this.state = { isScoring: false, currentHoleNr }

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

    realm.write(() => {

    });
  }

  render() {
    const { currentUser, event } = this.props;
    const { currentHoleNr } = this.state;
    const hole = event.course.holes[currentHoleNr - 1];

    const titleConfig = { title: `Hål ${currentHoleNr}`, tintColor: 'white'  };

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
        />

        {event.eventPlayers.map((player) => {
          return(
            <ScorecardPlayerRow
              playerId={player.id}
              hole={hole}
              setPlayerData={this._setPlayerData}
              showScoreForm={this._showScoreForm}
              closeScoreForm={this._closeScoreForm}
              key={`player_scorecard_row_${player.id}`}
            />
          )
        })}
      </View>
    );
  }
}
