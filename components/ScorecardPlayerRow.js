import React, {
  Component,
  View,
  TouchableOpacity,
  Text,
  PickerIOS
} from 'react-native';

import styles from '../styles';
import realm from '../realm';

const STROKE_VALUES = [1,2,3,4,5,6,7,8,9,10];
const PUTT_VALUES = [0,1,2,3,4,5,6,7,8,9,10];
const BEER_VALUES = [0,1,2,3,4,5];


export default class ScorecardPlayerRow extends Component {
  constructor(props) {
    super(props);
    const player = realm.objects('EventPlayer').filtered(`id == ${props.playerId}`)[0];
    const eventScore = player.eventScores.filter((es) => es.hole === props.hole.nr)[0];
    this.props.player = player;
    this.props.eventScore = eventScore;
  }

  render() {
    const { player, eventScore, showScoreForm, closeScoreForm, setPlayerData } = this.props;

    const isScoredStyle = eventScore.isScored ? styles.isScored : styles.needsScore;
    let rowView = (
      <View style={styles.playerRow}>
        <Text style={styles.playerName}>{player.name}</Text>
        <Text style={[styles.playerHoleData, isScoredStyle]}>{eventScore.strokes}</Text>
        <Text style={[styles.playerHoleData, isScoredStyle]}>{eventScore.putts}</Text>
        <Text style={[styles.playerHoleData, isScoredStyle]}>{eventScore.beers}</Text>
      </View>
    );

    const strokePicker = (
      <PickerIOS
        style={styles.picker}
        selectedValue={eventScore.strokes}
        onValueChange={(strokes) => setPlayerData(strokes, player.id, 'strokes')}>
        {STROKE_VALUES.map((val) => (
          <PickerIOS.Item
            key={val}
            value={val}
            label={`${val}`}
          />
        ))}
      </PickerIOS>
    );

    const puttPicker = (
      <PickerIOS
        style={styles.picker}
        selectedValue={eventScore.putts}
        onValueChange={(putts) => setPlayerData(putts, player.id, 'putts')}>
        {PUTT_VALUES.map((val) => (
          <PickerIOS.Item
            key={val}
            value={val}
            label={`${val}`}
          />
        ))}
      </PickerIOS>
    );

    const beerPicker = (
      <PickerIOS
        style={styles.picker}
        selectedValue={eventScore.beers}
        onValueChange={(beers) => setPlayerData(beers, player.id, 'beers')}>
        {BEER_VALUES.map((val) => (
          <PickerIOS.Item
            key={val}
            value={val}
            label={`${val}`}
          />
        ))}
      </PickerIOS>
    );

    let scoring;
    if(player.isScoring){
      scoring = (
        <View style={styles.scorebox}>
          <View style={{flexDirection: 'row'}}>
            {strokePicker}
            {puttPicker}
            {beerPicker}
          </View>
          <TouchableOpacity onPress={() => closeScoreForm(player.id)}>
            <Text style={styles.inlineBtn}>DONE</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      rowView = (
        <TouchableOpacity style={styles.scoreRow} onPress={() => showScoreForm(player.id)}>
          {rowView}
        </TouchableOpacity>
      );
    }

    return(
      <View style={(player.isScoring ? styles.scoring : styles.blank)} key={`player_row_${player.id}`}>
        {rowView}
        {scoring}
      </View>
    )
  }

}
