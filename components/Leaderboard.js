'use strict';

import React, {
  AsyncStorage,
  Component,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import { apiUrl } from '../lib/ApiService';

import LeaderboardCard from './LeaderboardCard';
import Loading from './Loading';

export default class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.onLogout = this.props.onLogout;
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = { dataSource: ds.cloneWithRows(props.currentUser.leaderboard) };
  }

  render() {
    const { dispatch, currentUser } = this.props;

    let content;
    if ( currentUser.leaderboard.length > 0 ) {
      content = (
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => <LeaderboardCard data={rowData} />}
        />
      );
    }

    const titleConfig = { title: 'Tisdagsgolfen', tintColor: 'white' };
    const leftButton = (
        <Icon
          style={[styles.headerBtn, styles.leftBtn]}
          name="person"
          size={20}
          onPress={() => dispatch({ type: 'openProfile' })}
        />
    );
    const rightButton = (
      <Icon
        style={[styles.headerBtn, styles.rightBtn]}
        name="calendar"
        size={20}
        onPress={() => dispatch({ type: 'openEvents' })}
      />
    );

    let eventBanner;
    const todayEvents = currentUser.current_season_events.filter((event) =>
      event.status === 'planned' && moment(event.starts_at).isSame(Date.now(), 'day')
    );
    if(todayEvents.length > 0) {
      eventBanner = (
        <TouchableOpacity
          style={styles.btn}
          onPress={() => dispatch({ type: 'showEvent', event: todayEvents[0] })}>
          <Text style={styles.btnLabel}>EVENT TODAY</Text>
        </TouchableOpacity>
      );
    }

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          title={titleConfig}
          leftButton={leftButton}
          rightButton={rightButton} />

          {content}

          {eventBanner}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  headerBtn: {
    marginTop: 20,
    color: '#eee'
  },
  leftBtn: {
    marginLeft: 20,
  },
  rightBtn: {
    marginRight: 20
  },
  header: {
    height: 60,
    backgroundColor: '#477dca'
  },
  btn: {
    marginTop: 10,
    padding: 20,
    paddingLeft: 60,
    paddingRight: 60,
    backgroundColor: 'green',
  },
  btnLabel: {
    textAlign: 'center',
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
  },
});
