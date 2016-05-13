import React, {Component} from "react";
import {Dimensions, StatusBar, Text, View, Image} from "react-native";

import realm from '../realm';
import { fetchClubs, fetchEvents, fetchPlayers } from '../lib/ApiService';
import styles from '../styles';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class DataSyncer extends Component {
  constructor(props) {
    super(props);
    this.syncedItems = []
  }

  setSyncedItem(what) {
    this.syncedItems.push(what);
    if(this.syncedItems.sort().toString() === 'clubs,events,players') {
      StatusBar.setNetworkActivityIndicatorVisible(false);
      realm.write(() => {
        this.props.currentUser.syncedTimestamp = `${new Date().getTime()}`;
      })
      this.props.onDone();
    }
  }


  componentWillMount() {
    const { needClubs, sessionToken } = this.props;

    StatusBar.setNetworkActivityIndicatorVisible(true);

    if(needClubs) {
      this.syncClubs();
    } else {
      this.setSyncedItem('clubs');
      this.syncEvents();
    }
    this.syncPlayers();
  }

  syncPlayers() {
    fetchPlayers(this.props.currentUser.sessionToken).then((players) => {
      this.setSyncedItem('players');
    }).catch((error) => {
      this.setSyncedItem('players');
      console.log('Error retreiving players', error);
    });
  }

  syncEvents() {
    fetchEvents(this.props.currentUser.sessionToken).then((players) => {
      this.setSyncedItem('events');
    }).catch((error) => {
      this.setSyncedItem('events');
      console.log('Error retreiving events', error);
    });
  }

  syncClubs() {
    fetchClubs().then(() => {
      this.setSyncedItem('clubs');
      this.syncEvents(this.props.currentUser.sessionToken);
    }).catch((error) => {
      this.setSyncedItem('clubs');
      console.log('Error retreiving clubs', error);
    })
  }

  render() {
    return(
      <View style={{
        flexDirection: 'column',
        paddingTop: 150,
        backgroundColor: '#477dca',
        alignItems: 'center',
        width: width,
        height: height
      }}>
        <StatusBar barStyle="light-content" />
        <Image source={require('../images/logo.png')} />
        <Text style={{textAlign: 'center', padding: 40, marginTop: 100, fontSize: 20, fontWeight: 'bold', color: '#fff'}}>
          Synkar data, borde gå snabbt...
        </Text>
      </View>
    )
  }
}
