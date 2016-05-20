'use strict';

import React, {Component} from "react";
import {Text, View} from "react-native";

import styles from '../styles';

export default class LeaderboardCard extends Component {
  render() {
    const { data, currentUserId } = this.props;
    if(data.num_events < 1) {
      return false;
    }

    const down = <Text style={{color: 'red', flex: 1, fontSize: 6, marginTop: 5}}>⇣</Text>;
    const up = <Text style={{color: 'green', flex: 1, fontSize: 6, marginTop: 5}}>⇡</Text>;
    const level = <Text style={{color: '#777', flex: 1, fontSize: 6, marginTop: 5}}>-</Text>;

    let up_or_down;
    if(data.position < data.prev_position) {
      up_or_down = <Text style={{color: 'green'}}>⇡{data.position - data.prev_position}</Text>;
    } else if(data.position > data.prev_position) {
      up_or_down = <Text style={{color: 'red'}}>⇣ {data.prev_position - data.position}</Text>;
    }

    const currentUserStyle = data.id === currentUserId ? {backgroundColor: '#feb'} : null;

    return(
      <View key={data.id} style={[styles.listrow, currentUserStyle]}>
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
