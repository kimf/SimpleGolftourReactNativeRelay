import React, {
  Component,
  DatePickerIOS,
  ScrollView,
  SegmentedControlIOS,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import Radio, { RadioButton } from 'react-native-simple-radio-button';

export default class NewEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      course: '',
      starts_at: new Date(),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
      scoring_type: 'points'
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(){
    const { starts_at, course, scoring_type, gametype, selectedIndex } = this.state;

    const team_event = selectedIndex === 1;

    Relay.Store.commitUpdate(
      new CreateEventMutation({
        text: text,
      }), {
       onFailure: () => {
         console.error('error!');
       },
       onSuccess: (response) => {
         console.log('success!')
       }
    });
  }

  render() {
    const { currentUser, dispatch } = this.props;
    const { selectedIndex, gametype, scoring_type, course, starts_at, timeZoneOffsetInHours } = this.state;
    const titleConfig = { title: 'New Event', tintColor: 'white'  };
    const leftButtonConfig = {
      title: '< Back',
      handler: () => dispatch({ type: 'back' }),
      tintColor: 'white'
    };

    let teamGameType;
    if(selectedIndex !== 0) {
      teamGameType = (
        <View style={styles.row}>
          <Text style={styles.label}>Gametype</Text>
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

    return(
      <ScrollView style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
        />

        <SegmentedControlIOS
          style={styles.segmentedcontrol}
          values={['Individual', 'Team']}
          selectedIndex={selectedIndex}
          tintColor="#477dca"
          onChange={(event) => {
            this.setState({selectedIndex: event.nativeEvent.selectedSegmentIndex});
          }}
        />

        <Text style={styles.label}>Course</Text>
        <TextInput
          style={styles.inputField}
          autoCapitalize="none"
          ref= "course"
          onChangeText={(course) => this.setState({course})}
          value={course}
        />

        <Text style={styles.label}>Starts at</Text>

        <DatePickerIOS
          date={starts_at}
          mode="datetime"
          timeZoneOffsetInMinutes={timeZoneOffsetInHours * 60}
          onDateChange={(starts_at) => this.setState({starts_at})}
          minuteInterval={10}
          style={styles.row}
        />

        {teamGameType}

        <View style={styles.row}>
          <Text style={styles.label}>{selectedIndex === 0 ? 'Gametype' : 'Scoring Type'}</Text>
          <Radio
            style={styles.radio}
            radio_props={[
              {label: 'Stableford', value: 'points' },
              {label: 'Strokes', value: 'strokes' }
            ]}
            initial={0}
            formHorizontal={true}
            onPress={(scoring_type) => {this.setState({scoring_type})}}
          />
        </View>

        <TouchableOpacity style={styles.btn} onPress={this.onSubmit}>
          <Text style={styles.btnLabel}> CREATE EVENT </Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    flex: 1
  },
  row: {
    flex: 1
  },
  header: {
    height: 60,
    backgroundColor: '#477dca'
  },
  heading: {
    fontSize: 40,
    marginTop: 20,
  },
  segmentedcontrol: {
    margin: 10,
  },
  label: {
    marginTop: 10,
    marginLeft: 10,
    color: '#444',
    fontSize: 16,
  },
  inputField: {
    padding: 5,
    margin: 10,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 4,
    fontSize: 16,
  },
  btn: {
    marginTop: 25,
    margin: 10,
    padding: 15,
    borderRadius: 5,
    backgroundColor: 'black'
  },
  btnLabel: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  datepicker: {
    height: 50
  },
  radio: {
    padding: 10
  }
});
