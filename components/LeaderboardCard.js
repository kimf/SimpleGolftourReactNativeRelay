'use strict';

import React, {
  Component,
  Text,
  View,
} from 'react-native';

import styles from '../styles';

export default class LeaderboardCard extends Component {
  render() {
    const { data } = this.props;

    const down = <Text style={{color: 'red', flex: 1, fontSize: 6, marginTop: 5}}>⇣</Text>;
    const up = <Text style={{color: 'green', flex: 1, fontSize: 6, marginTop: 5}}>⇡</Text>;
    const level = <Text style={{color: '#777', flex: 1, fontSize: 6, marginTop: 5}}>-</Text>;

    let up_or_down = '';
    if(data.position > data.prevPos) {
      up_or_down = <Text style={{color: 'green'}}>⇡{data.position - data.prevPos}</Text>;
    } else if(data.position < data.prevPos) {
      up_or_down = <Text style={{color: 'red'}}>⇣ {data.prevPos - data.position}</Text>;
    } else {
      up_or_down = <Text style={{color: '#777'}}>-</Text>;
    }

    return(
      <View key={data.id} style={styles.card}>
        <View style={styles.position}>
          <Text style={{flex: 1, fontWeight: 'bold', color: '#777'}}>{data.position}</Text>
           {up_or_down}
        </View>
        <View style={styles.cardTitle}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.meta}>{data.eventCount} Rundor - Genomsnitt: {data.average} poäng</Text>
        </View>
        <Text style={styles.points}>{parseInt(data.totalPoints, 10)} p</Text>
      </View>
    );
  }
}
