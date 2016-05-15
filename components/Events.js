'use strict';

import React, {Component} from "react";
import {StatusBar, Text, View, RefreshControl} from "react-native";
import NavigationBar from 'react-native-navbar';
import { ListView } from 'realm/react-native';

import EventCard from './EventCard';

import realm from '../realm';
import styles from '../styles';
import { fetchEvents } from '../lib/ApiService';

export default class Events extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { refreshing: false, dataSource: ds.cloneWithRows([]) };
    this.openNewEvent = this.openNewEvent.bind(this);
    this.setupEvent = this.setupEvent.bind(this);
    this.refreshEvents = this.refreshEvents.bind(this);
  }

  componentWillMount() {
    let events = realm.objects('Event').filtered('status == "planned"').sorted('startsAt');
    this.setEvents(events);
    // this.refreshEvents(events, false);
  }

  refreshEvents(events, setState = true) {
    if(setState) {
      this.setState({refreshing: true});
    }

    StatusBar.setNetworkActivityIndicatorVisible(true);
    fetchEvents(this.props.sessionToken).then((events) => {
      this.setEvents(events);
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }).catch((error) => {
      this.setState({refreshing: false});
      StatusBar.setNetworkActivityIndicatorVisible(false);
      console.log('Error retreiving data', error);
    });
  }

  setEvents(events) {
    const dataSource = this.state.dataSource.cloneWithRows(events);
    this.setState({refreshing: false, dataSource});
  }

  openNewEvent() {
    this.props.navigator.push({setCourse: 1});
  }

  setupEvent(event) {
    this.props.navigator.push({setupEvent: 1, event: event})
  }

  render() {
    const { dataSource, refreshing } = this.state;

    const titleConfig = { title: 'Rundor', tintColor: 'white'  };
    const rightButtonConfig = {
      title: '+ Ny',
      handler: this.openNewEvent,
      tintColor: 'white'
    };

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          rightButton={rightButtonConfig}
        />

        <ListView
          enableEmptySections
          dataSource={dataSource}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={this.refreshEvents}
              tintColor="#477dca"
              title="Uppdaterar..."
              titleColor="#477dca"
              progressBackgroundColor="#ffff00"
            />
          }
          renderRow={
            (rowData) => <EventCard event={rowData} setupEvent={this.setupEvent}/>
          }
        />
      </View>
    )
  }
}
