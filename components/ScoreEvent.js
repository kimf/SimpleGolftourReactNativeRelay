import React, {
  Component,
  View,
  TouchableOpacity,
  Text
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import Swiper from 'react-native-swiper';

const styles = require('../styles.js');

export default class ScoreEvent extends Component {
  constructor(props) {
    super(props);

    const currentPlayers = []
    for (let player of props.currentUser.leaderboard) {
      if(props.players.indexOf(player.id) !== -1) {
        currentPlayers.push({
          id: player.id,
          name: player.name
        });
      }
    }

    this.state = {
      players: currentPlayers,
      holes: [{nr: 1}, {nr: 2}, {nr: 3}, {nr: 4}]
    };
  }

  _toggleScoreForm(playerId, holeNr) {
    const players = [];
    for (let player of this.state.players) {
      if(player.id === playerId) {
        player.isScoring = holeNr;
      }
      players.push(player);
    }
    this.setState({players});
  }

  _renderHole(hole) {
    const titleConfig = { title: `Hål ${hole.nr}`, tintColor: 'white'  };

    return(
      <View style={styles.container} key={`hole_wrapper_${hole.nr}`}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
        />

        {this.state.players.map((player) => {
          const scoring = player.isScoring === hole.nr ? (
            <View style={styles.scorebox}>
              <Text>Scoring</Text>
              <TouchableOpacity onPress={() => this._toggleScoreForm(player.id, false)}>
                <Text style={styles.inlineBtn}>DONE</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={() => this._toggleScoreForm(player.id, hole.nr)}>
              <Text style={styles.inlineBtn}>SCORE</Text>
            </TouchableOpacity>
          )

          return(
            <View style={styles.card} key={`player_row_${player.id}`}>
              <Text>{player.name}</Text>
              {scoring}
            </View>
            )
        })}
      </View>
    );
  }

  render() {
    const { currentUser, event } = this.props;
    const { players, holes } = this.state;

    return(
      <View style={styles.container}>
        <Swiper showsButtons={true} loop={false} style={styles.holeSwiper}>
          {holes.map((hole) => {
            return(
              this._renderHole(hole)
            )
          })}
        </Swiper>
      </View>
    )
  }
}
