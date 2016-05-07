'use strict';

import React, {
  Component,
  Text,
  View,
} from 'react-native';

import realm from '../realm';

import NavigationBar from 'react-native-navbar';
import { ListView } from 'realm/react-native';
import EventCard from './EventCard';

import moment from 'moment';

import styles from '../styles';
import { apiUrl } from '../lib/ApiService';

export default class Events extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { dataSource: ds.cloneWithRows([]) };
  }

  componentDidMount() {
    const events = realm.objects('Event').sorted('startsAt', true);
    this.setEvents(events, true);

    if(events.length < 1) {
      this.fetchEvents(events);
    }
  }

  fetchEvents(events) {
    fetch(apiUrl + '/events', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${this.props.currentUser.session_token}`
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
            course: course,
          }, true);
        });
      });

      this.setEvents(events, false);
    }).catch((error) => {
      this.setState({loading: 'false'});
      console.log('Error retreiving data', error);
    })
  }

  setEvents(events, loading) {
    const dataSource = this.state.dataSource.cloneWithRows(events);
    this.setState({dataSource, loading});
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
