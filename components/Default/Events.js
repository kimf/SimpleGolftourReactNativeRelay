'use strict';

import React, {Component} from "react";
import {StatusBar, Text, View} from "react-native";
import NavigationBar from 'react-native-navbar';
import { ListView } from 'realm/react-native';

import EventCard from './EventCard';

import realm from '../../realm';
import styles from '../../styles';
import { fetchEvents } from '../../lib/ApiService';

export default class Events extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { dataSource: ds.cloneWithRows([]) };
  }

  componentWillMount() {
    let events = realm.objects('Event').filtered('status == "planned"').sorted('startsAt', true);
    this.setEvents(events);
    //this.refreshEvents(events);
  }

  refreshEvents(events) {
    StatusBar.setNetworkActivityIndicatorVisible(true);
    fetchEvents(this.props.sessionToken).then((players) => {
      this.setEvents(players);
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }).catch((error) => {
      StatusBar.setNetworkActivityIndicatorVisible(false);
      console.log('Error retreiving data', error);
    });
  }

  setEvents(events) {
    const dataSource = this.state.dataSource.cloneWithRows(events);
    this.setState({dataSource});
  }

  render() {
    const { dispatch } = this.props;
    const { dataSource } = this.state;

    const titleConfig = { title: 'Rundor', tintColor: 'white'  };
    const leftButtonConfig = {
      title: '< Tillbaka',
      handler: () => dispatch({ type: 'back' }),
      tintColor: 'white'
    };
    const rightButtonConfig = {
      title: '+ Ny',
      handler: () => dispatch({ type: 'newEvent' }),
      tintColor: 'white'
    };

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
          rightButton={rightButtonConfig}
        />

        <ListView
          enableEmptySections
          dataSource={dataSource}
          renderRow={(rowData) => <EventCard event={rowData} dispatch={dispatch} />}
        />
      </View>
    )
  }
}
