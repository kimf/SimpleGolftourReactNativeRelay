import React, {
  AsyncStorage,
  Component,
  DatePickerIOS,
  ScrollView,
  SegmentedControlIOS,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const styles = require('../styles.js');

import NavigationBar from 'react-native-navbar';
import Radio, { RadioButton } from 'react-native-simple-radio-button';
import moment from 'moment';
import CustomActionSheet from 'react-native-custom-action-sheet';

import { apiUrl } from '../lib/ApiService';

export default class NewEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      course: '',
      starts_at: new Date(),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
      scoring_type: 'points',
      showDatePicker: false
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.toggleDatePicker = this.toggleDatePicker.bind(this);
  }

  onSubmit(){
    const { starts_at, course, scoring_type, gametype, selectedIndex } = this.state;
    const { currentUser, dispatch } = this.props;
    const team_event = selectedIndex === 1;

    const url = apiUrl + '/events';

    fetch(url, {
      method: 'POST',
      crossOrigin: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${currentUser.session_token}`
      },
      body: JSON.stringify({
        starts_at, course, scoring_type, gametype, team_event
      })
    })
    .then((response) => {
      return response.json()
    })
    .then((event) => {
      currentUser.current_season_events.push(event);
      AsyncStorage.setItem('userData', JSON.stringify(currentUser));
      this.props.dispatch({ type: 'openEvents' });
    }).catch((error) => {
      alert('Kunde inte spara runda, Var god se över informationen');
      console.log('Error retreiving data', error);
    })
  }

  toggleDatePicker(){
    this.setState({showDatePicker: !this.state.showDatePicker});
  }

  render() {
    const { currentUser, dispatch } = this.props;
    const { selectedIndex, gametype, scoring_type, course, starts_at,
            timeZoneOffsetInHours, showDatePicker } = this.state;
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
            autoCapitalize="none"
            ref= "gametype"
            onChangeText={(gametype) => this.setState({gametype})}
            value={gametype}
          />
        </View>
      );
    }

    const datePicker = showDatePicker ? (
      <CustomActionSheet
        modalVisible={showDatePicker}
        onCancel={this.toggleDatePicker}
        buttonText="Stäng"
        backgroundColor="#eee">
        <View style={styles.datePickerContainer}>
          <DatePickerIOS
            date={starts_at}
            mode="datetime"
            timeZoneOffsetInMinutes={timeZoneOffsetInHours * 60}
            onDateChange={(starts_at) => this.setState({starts_at})}
            minuteInterval={10} />
        </View>
      </CustomActionSheet>
    ) : null;

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
        />
        <ScrollView>
          <SegmentedControlIOS
            style={styles.segmentedcontrol}
            values={['Individuellt', 'Lagtävling']}
            selectedIndex={selectedIndex}
            tintColor="#477dca"
            onChange={(event) => {
              this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
            }}
          />

          <Text style={styles.label}>Bana</Text>
          <TextInput
            style={styles.inputField}
            autoCapitalize="none"
            ref= "course"
            onChangeText={(course) => this.setState({course})}
            value={course}
          />

          <Text style={styles.label}>Starttid</Text>
          <TouchableOpacity onPress={this.toggleDatePicker} style={styles.toggleDatePicker}>
            <Text style={styles.selectedDate}>
              {moment(starts_at).format('dddd Do MMMM, HH:mm')}
            </Text>
          </TouchableOpacity>

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

          {datePicker}
        </ScrollView>
      </View>
    );
  }
}
