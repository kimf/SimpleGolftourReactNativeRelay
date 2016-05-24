'use strict';

import React, {Component} from "react";
import {StatusBar, Text, View, RefreshControl, ListView} from "react-native";
import NavigationBar from 'react-native-navbar';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { fetchEventsIfNeeded } from '../actions/events';
import { setupEvent } from '../actions/event';
import styles from '../styles';

import EventCard from '../components/EventCard';

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

export default class Events extends Component {
  constructor(props) {
    super(props);
    this.state = { dataSource: ds.cloneWithRows(props.events.data) }

    this.openNewEvent = this._openNewEvent.bind(this);
    this.setupEvent = this._setupEvent.bind(this);
    this.scoreEvent = this._scoreEvent.bind(this);
    this.followEvent = this._followEvent.bind(this);
    this.refreshEvents = this._refreshEvents.bind(this);
    this.refreshEvents();
  }

  _refreshEvents() {
    this.props.doFetch();
  }

  _openNewEvent() {
    this.props.navigator.push({setCourse: 1})
  }

  _setupEvent(event) {
    this.props.setupEvent(event);
    if(event.team_event) {
      this.props.navigator.push({setupTeamEvent: 1, event: event})
    } else {
      this.props.navigator.push({setupEvent: 1, event: event})
    }
  }

  _scoreEvent(event) {
    this.props.navigator.resetTo({ scoreEvent: 1, event: event })
  }

  _followEvent(event) {
    this.props.navigator.push({ followEvent: 1, event: event })
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.events.data !== this.props.events.data) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.events.data)
      })
    }
  }

  render() {
    const { events, scoringEvent } = this.props;

    const titleConfig = { title: 'Rundor', tintColor: 'white'  };
    const rightButtonConfig = {
      title: <Icon name="calendar-plus-o" size={20} />,
      handler: this.openNewEvent,
      tintColor: 'white'
    };

    return(
      <View style={[styles.container, {backgroundColor: '#eee'}]}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#0091e5'}}
          rightButton={rightButtonConfig}
        />

        <ListView
          enableEmptySections
          dataSource={this.state.dataSource}
          refreshControl={
            <RefreshControl
              refreshing={events.isFetching}
              onRefresh={this.refreshEvents}
              tintColor="#0091e5"
              title="Uppdaterar..."
              titleColor="#0091e5"
              progressBackgroundColor="#ffff00"
            />
          }
          renderRow={
            (rowData) => <EventCard
                            event={rowData}
                            scoringEvent={scoringEvent}
                            setupEvent={this.setupEvent}
                            setupTeamEvent={this.setupTeamEvent}
                            scoreEvent={this.scoreEvent}
                            followEvent={this.followEvent} />
          }
        />
      </View>
    )
  }
}


const mapStateToProps = (state) => {
  return {
    events: state.events,
    scoringEvent: state.event.event
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    doFetch: () => {
      dispatch(fetchEventsIfNeeded());
    },
    setupEvent: (event) => {
      dispatch(setupEvent(event));
    },
    setupTeamEvent: (event) => {
      dispatch(setupTeamEvent(event));
    }
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Events)
