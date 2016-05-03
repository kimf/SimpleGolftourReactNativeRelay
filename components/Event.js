'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import NavigationBar from 'react-native-navbar';

export default class Event extends Component {

  render() {
    const { currentUser, event, dispatch } = this.props;
    const titleConfig = { title: `${event.course}`, tintColor: 'white'  };
    const leftButtonConfig = {
      title: '< Bakåt',
      handler: () => dispatch({ type: 'back' }),
      tintColor: 'white'
    };

    let scoreButton;
    if(event.status !== 'finished') {
      scoreButton = (
        <TouchableOpacity onPress={() => dispatch({ type: 'selectPlayers', event: event })} style={styles.btn}>
          <Text style={styles.btnLabel}> STARTA RUNDA </Text>
        </TouchableOpacity>
      );
    }


    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
        />
        <View style={styles.container}>
          <Text>{event.status}</Text>
          <Text>{event.starts_at}</Text>
          <Text>{event.gametype}</Text>
          <Text>{event.course}</Text>
          <Text>{event.scoring_type}</Text>
          <Text>{event.team_event}</Text>
        </View>
        {scoreButton}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ccc',
    flex: 1
  },
  header: {
    height: 60,
    backgroundColor: '#477dca'
  },
  btn: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20
  },
  btnLabel: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
    paddingLeft: 40,
    paddingRight: 40,
  },
});
