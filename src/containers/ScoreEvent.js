import React, {Component} from "react";
import {
  Alert, View, Text, TouchableOpacity, ScrollView, StatusBar, InteractionManager
} from "react-native";

import NavigationBar from 'react-native-navbar';
import SwipeableViews from 'react-swipeable-views/lib/index.native.animated';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { connect } from 'react-redux';

import SaveRoundView from '../components/Scoring/SaveRoundView';
import HoleView from '../components/Scoring/HoleView';

import { createEventScore, changeHole } from '../actions/event';

import styles from '../styles';
import clubsJson from '../../lib/clubs.json';

class ScoreEvent extends Component {
  constructor(props) {
    super(props);
    const club = clubsJson.clubs.find(c => c.name === props.event.club);
    this.course = club.courses.find(c => c.id === props.event.course_id);
    this.holes = this.course.holes.sort((a, b) => a.number - b.number);
    this.holeNumbers = this.holes.map(val => val.number);

    this.changeHole = this._changeHole.bind(this);
  }

  _changeHole(index) {
    const { event, changeHole } = this.props;
    changeHole(index + 1);
  }

  render() {
    const { event, playing, navigator, createEventScore, currentHole } = this.props;

    const titleConfig = { title: event.course, tintColor: 'white'  };
    const rightButtonConfig = {
      title: <Icon name="list-ol" size={20} />,
      handler: () => requestAnimationFrame(() => navigator.push({showScorecard: 1, event})),
      tintColor: 'white'
    };

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          rightButton={rightButtonConfig} />

        <SwipeableViews
          style={styles.slideContainer}
          index={currentHole - 1}
          onChangeIndex={this.changeHole}
          autoplay={false}

          resistance>
          {this.holes.map((hole) => {
            return(
              <HoleView
                key={`hole_view_${hole.id}`}
                hole={hole}
                playing={playing}
                holesCount={this.holes.length}
                event={event}
                createEventScore={createEventScore}
              />
            )
          })}
        </SwipeableViews>

        <View style={{height: 20}}>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'flex-start'}}>
          {this.holeNumbers.map((hole) => {
            let activeStyle;
            if(hole === currentHole){
              activeStyle = {color: '#fff', backgroundColor: '#444'}
            }

            return (
              <TouchableOpacity key={`hole_footer_button_${hole}`} style={[{flex: 1}]} onPress={() => this.changeHole(hole - 1)}>
                <Text style={[activeStyle, {fontSize: 10, padding: 3, color: '#ccc', textAlign: 'center'}]}>{hole}</Text>
              </TouchableOpacity>
            )
          })}
          </View>
        </View>
      </View>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    event: state.event.event,
    playing: state.event.playing,
    currentHole: state.event.currentHole
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    createEventScore: (playerId, holeNr, data) => {
      dispatch(createEventScore(playerId, holeNr, data))
    },
    changeHole: (holeNr) => {
      dispatch(changeHole(holeNr))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ScoreEvent)
