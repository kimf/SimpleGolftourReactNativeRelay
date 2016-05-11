'use strict';

import React, {Component} from "react";
import {StatusBar, Text, View} from "react-native";
import NavigationBar from 'react-native-navbar';
import { ListView } from 'realm/react-native';
import moment from 'moment';

import EventCard from './EventCard';

import realm from '../../realm';
import styles from '../../styles';
import { apiUrl } from '../../lib/ApiService';

export default class Events extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { dataSource: ds.cloneWithRows([]) };
  }

  componentWillMount() {
    let events = realm.objects('Event').filtered('status == "planned"').sorted('startsAt', true);
    this.setEvents(events);
    if(events.length === 0) {
      this.fetchEvents(events);
    }
  }

  fetchEvents(events) {
    StatusBar.setNetworkActivityIndicatorVisible(true);
    fetch(apiUrl + '/events', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${this.props.sessionToken}`
      }
    })
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      json.events.map((event) => {
        const course = realm.objects('Course').filtered(`id == ${event.course_id}`)[0];
        realm.write(() => {
          realm.create('Event', {
            id: event.id,
            startsAt: moment(event.starts_at).toDate(),
            status: event.status,
            gametype: event.gametype,
            scoringType: event.scoring_type,
            teamEvent: event.team_event,
            course: course
          }, true);
        });
      });
      StatusBar.setNetworkActivityIndicatorVisible(false);
      this.setEvents(events);
    }).catch((error) => {
      StatusBar.setNetworkActivityIndicatorVisible(false);
      console.log('Error retreiving data', error);
    })
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