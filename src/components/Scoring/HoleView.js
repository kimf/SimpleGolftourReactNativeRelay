import React, {Component} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import ScoringScreen from './ScoringScreen';
import ScoreRow from './ScoreRow';
import styles from '../../styles';

export default class HoleView extends Component {
  constructor(props) {
    super(props);
    this.state = { scoringPlayer: null }
    this.showScoreForm = this._showScoreForm.bind(this);
    this.closeScoreForm = this._closeScoreForm.bind(this);
    this.renderRows = this.renderRows.bind(this);
  }

  _showScoreForm(player, eventScore) {
    this.setState({ scoringPlayer: player, scoringEventScore: eventScore  });
  }

  _closeScoreForm(strokes, putts, points) {
    const { scoringPlayer, scoringEventScore } = this.state;
    this.props.saveEventScore(scoringPlayer.id, scoringEventScore.hole, strokes, putts, points);
    this.setState({ scoringPlayer: null, scoringEventScore: null });
  }

  renderRows() {
    const { event, hole, holesCount, playing, createEventScore } = this.props;
    const rows = [];
    playing.map((player) => {
      const eventScore = player.eventScores.find(es => es.hole === hole.number);
      rows.push(
        <ScoreRow
          player={player}
          showScoreForm={this.showScoreForm}
          hole={hole}
          eventScore={eventScore}
          holesCount={holesCount}
          createEventScore={createEventScore}
          key={`player_score_row_${player.id}`}
        />
      )
    })
    return rows;
  }

  render(){
    const { event, hole, sessionToken } = this.props;
    const { scoringPlayer, scoringEventScore } = this.state;

    let content;
    if(scoringPlayer) {
      content = (
        <ScoringScreen
          closeScoreForm={this.closeScoreForm}
          player={scoringPlayer}
          eventScore={scoringEventScore}
          eventId={event.id}
          par={hole.par}
          key={`player_scoring_screen_${scoringPlayer.id}`}
        />
      )
    } else {
      content = this.renderRows();
    }

    return(
      <View>
        <View style={styles.inlineHeader}>
          <Text style={[styles.holeHeaderText]}>
            {`Hål ${hole.number} - Par ${hole.par} - Index: ${hole.index}`}
          </Text>
        </View>

        <View style={styles.scoreHeaderRow}>
          <Text style={styles.scoreHeaderPlayer}>SPELARE</Text>
          <Text style={styles.scoreHeader}>SLAG</Text>
          <Text style={styles.scoreHeader}>PUTTAR</Text>
          <Text style={[styles.scoreHeader]}>POÄNG</Text>
        </View>

        { content }
      </View>
    )
  }
}
