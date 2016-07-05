import React, {Component} from "react";
import {View, Text, TouchableOpacity, Dimensions} from "react-native";
import ScoringScreen from './ScoringScreen';
import ScoreRow from './ScoreRow';
import styles from '../../styles';

const width = Dimensions.get('window').width; //full width

export default class HoleView extends Component {
  constructor(props) {
    super(props);
    this.state = { scoringItem: null }
    this.showScoreForm = this._showScoreForm.bind(this);
    this.closeScoreForm = this._closeScoreForm.bind(this);
    this.renderRows = this.renderRows.bind(this);
  }

  _showScoreForm(item, eventScore) {
    this.setState({ scoringItem: item, scoringEventScore: eventScore  });
  }

  _closeScoreForm(strokes, putts, points) {
    const { event } = this.props;
    const { scoringItem, scoringEventScore } = this.state;
    this.props.saveEventScore(event.id, scoringItem, scoringEventScore, strokes, putts, points);
    this.setState({ scoringItem: null, scoringEventScore: null });
  }

  renderRows() {
    const { event, hole, holesCount, playing, createEventScore } = this.props;
    const rows = [];
    playing.map((item) => {
      const eventScore = item.eventScores.find(es => es.hole === hole.number);
      rows.push(
        <ScoreRow
          player={item}
          showScoreForm={this.showScoreForm}
          hole={hole}
          eventScore={eventScore}
          holesCount={holesCount}
          scoringType={event.scoring_type}
          teamEvent={event.team_event}
          createEventScore={createEventScore}
          key={`player_score_row_${item.id}`}
        />
      )
    })
    return rows;
  }

  render(){
    const { event, hole, sessionToken } = this.props;
    const { scoringItem, scoringEventScore } = this.state;

    let content;
    if(scoringItem) {
      content = (
        <ScoringScreen
          closeScoreForm={this.closeScoreForm}
          player={scoringItem}
          eventScore={scoringEventScore}
          eventId={event.id}
          modifiedPoints={event.scoring_type === 'modified_points'}
          teamEvent={event.team_event}
          par={hole.par}
          key={`player_scoring_screen_${scoringItem.id}`}
        />
      )
    } else {
      content = this.renderRows();
    }

    const puttsHeader = event.team_event ? null : (
      <Text style={styles.scoreHeader}>PUTTAR</Text>
    )

    return(
      <View style={{width: width, padding: 5, backgroundColor: '#fff'}}>
        <View style={[styles.inlineHeader, {paddingTop: 10, paddingBottom: 10, flex: 1, flexDirection: 'row', alignItems: 'stretch', backgroundColor: '#3C3C3C'}]}>
          <Text style={[styles.holeHeaderText, {lineHeight: 30, flex: 1, color: '#fff', fontWeight: 'bold'}]}>
            Par {hole.par}
          </Text>
          <Text style={[styles.holeHeaderText, {flex: 1, fontSize: 25, color: '#fff', fontWeight: 'bold'}]}>
            {hole.number}
          </Text>
          <Text style={[styles.holeHeaderText, {lineHeight: 30, flex: 1, color: '#fff', fontWeight: 'bold'}]}>
            Index: {hole.index}
          </Text>
        </View>

        <View style={styles.scoreHeaderRow}>
          <Text style={styles.scoreHeaderPlayer}>SPELARE</Text>
          <Text style={styles.scoreHeader}>SLAG</Text>
          {puttsHeader}
          <Text style={[styles.scoreHeader]}>POÄNG</Text>
        </View>

        { content }
      </View>
    )
  }
}
