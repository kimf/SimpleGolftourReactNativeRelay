'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';


export default class EventCard extends Component {
  render() {
    const { data } = this.props;
    const down = <Text style={{color: 'red', flex: 1, fontSize: 6, marginTop: 5}}>⇣</Text>;
    const up = <Text style={{color: 'green', flex: 1, fontSize: 6, marginTop: 5}}>⇡</Text>;
    const level = <Text style={{color: '#777', flex: 1, fontSize: 6, marginTop: 5}}>-</Text>;

    let up_or_down;
    if(data.position > data.prev_position) {
      up_or_down = <Text style={{color: 'green'}}>⇡{data.position - data.prev_position}</Text>;
    } else if(data.position < data.prev_position) {
      up_or_down = <Text style={{color: 'red'}}>⇣ {data.prev_position - data.position}</Text>;
    } else {
      up_or_down = <Text style={{color: '#777'}}>⇡2</Text>;
    }

    return(
      <View key={data.id} style={styles.usercard}>
        <View style={styles.position}>
          <Text style={{flex: 1, fontWeight: 'bold', color: '#777'}}>{data.position}</Text>
           {up_or_down}
        </View>
        <View style={styles.cardTitle}>
          <Text style={styles.name}>{data.name}</Text>
          <Text style={styles.meta}>{data.num_events} Rundor - Genomsnitt: {data.average} poäng</Text>
        </View>
        <Text style={styles.points}>{parseInt(data.total_points, 10)} p</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  usercard: {
    borderBottomWidth: 1,
    borderColor: '#cecece',
    flexDirection: 'row',
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    marginTop: 10,
  },
  points: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1
  },
  position: {
    marginRight: 5,
    width: 40,
    flexDirection: 'column',
  },

  cardTitle: {
    flex: 5,
    flexDirection: 'column',
  },
  meta: {
    color: '#777',
    flex: 1,
    fontSize: 12,
    marginTop: 3,
  },
  name: {
    fontWeight: 'bold',
    flex: 1,
    fontSize: 14,
  }
});
