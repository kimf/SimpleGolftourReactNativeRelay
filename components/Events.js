'use strict';

import React, {
  AsyncStorage,
  Component,
  SegmentedControlIOS,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import NavigationBar from 'react-native-navbar';

import EventList from './EventList';

import { apiUrl } from '../lib/ApiService';

export default class Events extends Component {
  constructor(props) {
    super(props);
    this.state = { selectedIndex: 0};
  }

  render() {
    const { events, dispatch } = this.props;
    const { selectedIndex } = this.state;

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

    let visibleEvents;
    if (selectedIndex === 0) {
      visibleEvents = events.filter(event => event.status !== 'finished');
    } else {
      visibleEvents = events.filter(event => event.status === 'finished');
    }

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
          rightButton={rightButtonConfig}
        />

        <SegmentedControlIOS
          style={styles.segmentedcontrol}
          values={['Kommande', 'Redan spelade']}
          selectedIndex={selectedIndex}
          tintColor="#477dca"
          onChange={(event) => {
            this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
          }}
        />

        <EventList
          events={visibleEvents}
          dispatch={dispatch}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  header: {
    height: 60,
    backgroundColor: '#477dca'
  },
  segmentedcontrol: {
    margin: 10,
  }
});
