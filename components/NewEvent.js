import React, {
  AsyncStorage,
  Component,
  DatePickerIOS,
  ScrollView,
  SegmentedControlIOS,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal
} from 'react-native';

import styles from '../styles';
import realm from '../realm';

import NavigationBar from 'react-native-navbar';
import Radio, { RadioButton } from 'react-native-simple-radio-button';
import moment from 'moment';
import CustomActionSheet from 'react-native-custom-action-sheet';
import Spinner from 'react-native-loading-spinner-overlay';

import SetCourse from './SetCourse';

import { apiUrl, courseApiUrl } from '../lib/ApiService';

export default class NewEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
      starts_at: new Date(),
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
      scoring_type: 'points',
      showDatePicker: false,
      showClubPickerModal: false,
      loadingClubs: false,
      gametype: 'Stableford',
      clubs: []
    };

    this.onSubmit = this.onSubmit.bind(this);
    this.toggleDatePicker = this.toggleDatePicker.bind(this);
    this.selectClub = this.selectClub.bind(this);
    this.setCourse = this._setCourse.bind(this);
  }

  componentWillMount() {
    let clubs = realm.objects('Club').sorted('name');
    // let courses = realm.objects('Course');
    // let holes = realm.objects('Hole');
    // realm.write(() => {
    //   realm.delete(clubs);
    //   realm.delete(courses);
    //   realm.delete(holes);
    // })

    if (clubs.length > 1) {
      this.setState({clubs});
    } else {
      this.setState({course: 'Laddar banor...', loadingClubs: true});

      fetch(courseApiUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        json.clubs.map((club) => {
          realm.write(() => {
            const courses = [];
            club.courses.map((course) => {
              const holes = [];
              course.holes.map((hole) => {
                holes.push({
                  id: hole.id,
                  number: hole.number,
                  index: hole.index,
                  par: hole.par
                });
              });

              courses.push({
                id: course.id,
                name: course.name,
                holes_count: course.holes_count,
                par: course.par,
                holes: holes
              });
            })

            realm.create('Club', {
              id: club.id,
              name: club.name,
              courses: courses
            });
          });
        });

        this.setState({course: null, loadingClubs: false, clubs: clubs});
      }).catch((error) => {
        this.setState({course: 'Gick inte att ladda banor!', loadingClubs: false});
        console.log('Error retreiving data', error);
      })
    }
  }

  onSubmit(){
    const { starts_at, scoring_type, gametype, selectedIndex } = this.state;
    const { currentUser, dispatch } = this.props;
    const team_event = selectedIndex === 1;

    const url = apiUrl + '/events';

    const course = this.state.course.name;
    const course_id = this.state.course.id;

    fetch(url, {
      method: 'POST',
      crossOrigin: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${currentUser.session_token}`
      },
      body: JSON.stringify({
        starts_at, course, scoring_type, gametype, team_event, course_id
      })
    })
    .then((response) => {
      return response.json()
    })
    .then((event) => {
      console.log(event);
      realm.write(() => {
        realm.create('Event', {
          id: event.id,
          startsAt: moment(event.starts_at).toDate(),
          status: event.status,
          gametype: event.gametype,
          scoringType: event.scoring_type,
          teamEvent: event.team_event,
          courseName: event.course,
          courseId: event.course_id
        }, true);
      });
      this.props.dispatch({ type: 'eventWasCreated' });
    }).catch((error) => {
      alert('Kunde inte spara runda, Var god se över informationen');
      console.log('Error retreiving data', error);
    })
  }

  toggleDatePicker(){
    this.setState({showDatePicker: !this.state.showDatePicker});
  }

  selectClub(){
    this.setState({showClubPickerModal: true})
  }

  _setCourse(course) {
    this.setState({course: course, showClubPickerModal: false})
  }

  render() {
    const { currentUser, dispatch } = this.props;
    const { selectedIndex, gametype, scoring_type, course,
            starts_at, timeZoneOffsetInHours, showDatePicker,
            loadingClubs, showClubPickerModal, clubs
          } = this.state;

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
        <Spinner visible={loadingClubs} />
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

          <Text style={styles.label}>Vilken bana</Text>
          <TouchableOpacity onPress={this.selectClub} style={styles.toggleDatePicker}>
            <Text style={styles.selectedDate}>
              { course ? course.name : 'Välj bana ->'}
            </Text>
          </TouchableOpacity>

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

        <Modal
          animated={true}
          transparent={false}
          visible={showClubPickerModal}
          >
          <SetCourse clubs={clubs} setCourse={this.setCourse} />
        </Modal>
      </View>
    );
  }
}
