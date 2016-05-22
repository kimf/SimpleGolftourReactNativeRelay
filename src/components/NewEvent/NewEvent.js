import React, {Component} from "react";
import {
  Switch, DatePickerIOS, Text, TouchableOpacity, View, StyleSheet
} from "react-native";

import { connect } from 'react-redux';
import NavigationBar from 'react-native-navbar';
import moment from 'moment';

import { tryToSaveEvent } from '../../actions/events';

import styles from '../../styles';

class NewEvent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      teamEvent: false,
      scoringType: 'points',
      date: new Date(),
    };

    this.state.date.setHours(17);
    this.state.date.setMinutes(0);

    this.onSubmit = this.onSubmit.bind(this);
    this.onDateChange = this.onDateChange.bind(this);
    this.close = this.close.bind(this);
  }

  onSubmit(){
    const { isStrokes, teamEvent, date } = this.state;
    const { course, navigator } = this.props;

    const event = {
      courseName: course.name,
      clubName: course.clubName,
      courseId: course.id,
      teamEvent: teamEvent,
      date: date,
      scoringType: isStrokes ? 'strokes' : 'points'
    };

    this.props.saveEvent(event, navigator);
  }

  onDateChange(date) {
    this.setState({date});
  }

  close() {
    const { navigator } = this.props;
    if (navigator) {
      requestAnimationFrame(() => navigator.pop());
    }
  }

  render() {
    const { course, navigator, isSaving, error } = this.props;
    const { teamEvent, isStrokes, date, timeZoneOffsetInHours } = this.state;

    const titleConfig = { title: 'Ny Runda', tintColor: 'white'  };
    const leftButtonConfig = {
      title: '< Välj bana',
      handler: this.close,
      tintColor: 'white'
    };

    let showError;
    if(error) {
      showError = <Text style={{color: '#c00', fontSize: 20}}>Något gick fel med att spara, se över infon</Text>;
    }

    return(
      <View style={[styles.container, {alignItems: 'stretch', flexDirection: 'column'}]}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
        />
        <View style={styles.inlineHeader}>
          <Text style={styles.centerText}>{course.name}</Text>
        </View>

        {showError}

        <View style={[styles.formRow, {flexDirection: 'row'}]}>
          <View style={[styles.formColumn, {borderRightWidth: StyleSheet.hairlineWidth, borderColor: '#cecece'}]}>
            <Text style={styles.label}>Lagtävling?</Text>
            <Switch
              onValueChange={(teamEvent) => this.setState({teamEvent})}
              style={styles.formColumnContent}
              value={teamEvent} />
          </View>
          <View style={styles.formColumn}>
            <Text style={styles.label}>Slaggolf?</Text>
            <Switch
              onValueChange={(isStrokes) => this.setState({isStrokes})}
              style={styles.formColumnContent}
              value={isStrokes} />
          </View>
        </View>

        <View style={styles.formRow}>
          <Text style={styles.label}>Starttid</Text>
          <DatePickerIOS
            date={date}
            mode="datetime"
            onDateChange={this.onDateChange}
          />
        </View>


        <TouchableOpacity style={styles.btn} onPress={this.onSubmit}>
          <Text style={styles.btnLabel}>{isSaving ? 'SPARAR...' : 'SKAPA RUNDA'}</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isSaving: state.events.isSaving,
    error: state.events.error
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    saveEvent: (event, navigator) => {
      dispatch(tryToSaveEvent(event, navigator))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewEvent)
