'use strict';

import React, {
  Component,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

class EventCard extends Component {
  render() {
    const { event, dispatch } = this.props;

    return(
      <TouchableOpacity onPress={() => dispatch({ type: 'showEvent', event: event})}>
        <View style={styles.card}>
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
    backgroundColor: '#eee',
    flex: 1
  },

  card: {
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'column',
    margin: 5,
    padding: 10,
    marginTop: 10,
  }
});
