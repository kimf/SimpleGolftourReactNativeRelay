'use strict';

import React, {Component} from "react";
import { Text, View, LayoutAnimation, TouchableOpacity } from "react-native";

import styles from '../styles';

export default class LeaderboardCard extends Component {
  constructor(props) {
    super(props);

    const { data: player, currentUserId } = props;
    if(player.position < player.prev_position) {
      this.up_or_down = <Text style={{color: 'green'}}>⇡{player.position - player.prev_position}</Text>;
    } else if(player.position > player.prev_position) {
      this.up_or_down = <Text style={{color: 'red'}}>⇣ {player.prev_position - player.position}</Text>;
    }

    this.currentUserStyle = player.id === currentUserId ? {backgroundColor: '#feb'} : null;

    this.state = { open: false };
    this.onPressCard = this._onPressCard.bind(this);
    this.renderContentClosed = this._renderContentClosed.bind(this);
    this.renderContentOpen = this._renderContentOpen.bind(this);
  }

  _onPressCard() {
    const config = animations.layout.easeInEaseOut
    LayoutAnimation.configureNext(config)
    this.setState({ open: !this.state.open });
  }

  _renderContentClosed() {
    const data = this.props.data;
    return(
      <TouchableOpacity onPress={this.onPressCard} activeOpacity={0.7}>
        <View key={data.id} style={[styles.listrow, this.currentUserStyle]}>
          <View style={styles.position}>
            <Text style={{flex: 1, fontWeight: 'bold', color: '#777'}}>{data.position}</Text>
             {this.up_or_down}
          </View>
          <View style={styles.cardTitle}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.meta}>{data.num_events} Rundor - Genomsnitt: {data.average} poäng</Text>
          </View>
          <Text style={styles.points}>{parseInt(data.total_points, 10)} p</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderContentOpen() {
    const data = this.props.data;
    return(
      <TouchableOpacity onPress={this.onPressCard} activeOpacity={0.7}>
        <View key={data.id} style={[styles.listrow, this.currentUserStyle]}>
          <View style={styles.position}>
            <Text style={{flex: 1, fontWeight: 'bold', color: '#000', fontSize: 20}}>{data.position}</Text>
             {this.up_or_down}
          </View>
          <View style={styles.cardTitle}>
            <Text style={styles.name}>{data.name}</Text>
            <Text style={styles.meta}>{data.num_events} Rundor - Genomsnitt: {data.average} poäng</Text>
          </View>
          <Text style={styles.points}>{parseInt(data.total_points, 10)} p</Text>
          <View style={styles.cardTitle}>
            <Text style={styles.largeText}>...HÄR KOMMER MER INFO SNART...</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { data } = this.props;
    if(data.num_events < 1) {
      return null;
    } else if (this.state.open) {
      return this.renderContentOpen();
    } else {
      return this.renderContentClosed();
    }
  }
}


const animations = {
  layout: {
    easeInEaseOut: {
      duration: 260,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.scaleXY,
      },
      update: {
        delay: 30,
        type: LayoutAnimation.Types.easeInEaseOut,
      },
    },
  },
}
