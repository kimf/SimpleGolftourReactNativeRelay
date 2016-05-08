import React, {Component} from "react";
import {DatePickerIOS, SegmentedControlIOS, Text, TextInput, TouchableOpacity, View} from "react-native";

import styles from '../styles';
import realm from '../realm';

import NavigationBar from 'react-native-navbar';
import Radio, { RadioButton } from 'react-native-simple-radio-button';
import moment from 'moment';

import { apiUrl } from '../lib/ApiService';

export default class NewEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedIndex: 0,
      scoring_type: 'points',
      gametype: 'Stableford',
      date: new Date(),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
  }

  onSubmit(){
    const { scoring_type, gametype, selectedIndex, date } = this.state;
    const { course, dispatch, sessionToken } = this.props;
    const team_event = selectedIndex === 1;

    const url = apiUrl + '/events';
    const starts_at = date;

    fetch(url, {
      method: 'POST',
      crossOrigin: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${sessionToken}`
      },
      body: JSON.stringify({
        course: course.name, course_id: course.id, starts_at, scoring_type, gametype, team_event
      })
    })
    .then((response) => {
      return response.json()
    })
    .then((event) => {
      const realmCourse = realm.objects('Course').filtered(`id == ${course.id}`)[0];
      realm.write(() => {
        realm.create('Event', {
          id: event.id,
          startsAt: moment(event.starts_at).toDate(),
          status: event.status,
          gametype: event.gametype,
          scoringType: event.scoring_type,
          teamEvent: event.team_event,
          course: realmCourse
        });
      });
      dispatch({ type: 'eventWasCreated' });
    }).catch((error) => {
      alert('Kunde inte spara runda, Var god se över informationen');
      console.log('Error retreiving data', error);
    })
  }

  onDateChange(date) {
    this.setState({date});
  }

  render() {
    const { course, dispatch } = this.props;
    const { selectedIndex, gametype, scoring_type, date, timeZoneOffsetInHours } = this.state;

    const titleConfig = { title: 'Ny Runda', tintColor: 'white'  };
    const leftButtonConfig = {
      title: '< Bakåt',
      handler: () => dispatch({ type: 'back' }),
      tintColor: 'white'
    };

    let teamGameType;
    if(selectedIndex !== 0) {
      teamGameType = (
        <View style={styles.row}>
          <Text style={styles.label}>Spelsätt</Text>
          <TextInput
            style={styles.inputField}
            autoCapitalize="words"
            selectTextOnFocus={true}
            ref="gametype"
            onChangeText={(gametype) => this.setState({gametype})}
            value={gametype}
          />
        </View>
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

        <SegmentedControlIOS
          style={styles.segmentedcontrol}
          values={['Individuellt', 'Lagtävling']}
          selectedIndex={selectedIndex}
          tintColor="#477dca"
          onChange={(event) => {
            this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
          }}
        />

        <Text style={styles.label}>Vilken bana</Text>
        <TouchableOpacity onPress={() => dispatch({ type: 'selectCourse' })} style={styles.toggleDatePicker}>
          <Text style={styles.selectedDate}>
            { course ? course.name : 'Välj bana ->'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Starttid</Text>
        <Text style={styles.selectedDate}>
          { date ? moment(date).format('dddd Do MMMM, HH:mm') : 'Välj Starttid ->'}
        </Text>
        <DatePickerIOS
          date={date}
          mode="datetime"
          timeZoneOffsetInMinutes={timeZoneOffsetInHours * 60}
          onDateChange={this.onDateChange}
        />

        {teamGameType}

        <View style={styles.row}>
          <Text style={styles.label}>{selectedIndex === 0 ? 'Spelsätt' : 'Poängräkning'}</Text>
          <Radio
            style={styles.radio}
            radio_props={[
              {label: 'Poäng', value: 'points' },
              {label: 'Slag', value: 'strokes' }
            ]}
            initial={0}
            formHorizontal={true}
            onPress={(scoring_type) => {this.setState({scoring_type})}}
          />
        </View>

        <TouchableOpacity style={styles.btn} onPress={this.onSubmit}>
          <Text style={styles.btnLabel}> SKAPA RUNDA </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
