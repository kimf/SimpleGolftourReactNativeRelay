'use strict';

import React, {
  Component,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import moment from 'moment';

class EventCard extends Component {
  render() {
    const { event, dispatch } = this.props;
    let today;
    if(moment(event.starts_at).isSame(Date.now(), 'day')){
      today = (
        <Text style={{fontSize: 16, fontWeight: 'bold', color: 'green'}}>IDAG</Text>
      );
    }

    return(
      <TouchableOpacity onPress={() => dispatch({ type: 'showEvent', event: event})}>
        <View style={styles.card}>
          {today}
          <Text>{event.status}</Text>
          <Text>Starts at: {event.starts_at}</Text>
          <Text>Gametype: {event.gametype}</Text>
          <Text>Course: {event.course}</Text>
          <Text>Scoring: {event.scoring_type}</Text>
          <Text>{event.team_event ? 'Team Event' : 'Individual Event'}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

export default class EventList extends Component {

  render() {
    const { events, dispatch } = this.props;

    return(
      <View style={styles.container}>
        <ScrollView>
           {events.map(event =>
              <EventCard key={event.id} event={event} dispatch={dispatch} />
           )}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },

  card: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    flexDirection: 'column',
    margin: 5,
    padding: 10,
    marginTop: 10,
  }
});
