import React, {Component} from "react";
import {
  Alert, View, Text, TouchableOpacity, ScrollView, StatusBar, InteractionManager, Dimensions
} from "react-native";
const width = Dimensions.get('window').width; //full width

import NavigationBar from 'react-native-navbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import { connect } from 'react-redux';

import HoleView from '../components/Scoring/HoleView';

import { saveEventScore, createEventScore, changeHole } from '../actions/event';

import styles from '../styles';

let _scrollView;

class ScoreEvent extends Component {
  constructor(props) {
    super(props);
    this.changeHole = this._changeHole.bind(this);
  }

  _changeHole(holeNr) {
    const { event, changeHole } = this.props;
    changeHole(holeNr);
    //_scrollView.scrollTo({x: (holeNr * width) - width, animated: false});
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.currentHole !== this.props.currentHole) {
      _scrollView.scrollTo({x: (nextProps.currentHole * width) - width, animated: true});
    }
  }

  componentDidMount() {
    _scrollView.scrollTo({x: (this.props.currentHole * width) - width, animated: false});
  }

  render() {
    const { event, playing, navigator, saveEventScore, createEventScore, currentHole } = this.props;

    const titleConfig = { title: event.course, tintColor: 'white'  };
    const rightButtonConfig = {
      title: <Icon name="list-ol" size={20} />,
      handler: () => requestAnimationFrame(() => navigator.push({showScorecard: 1})),
      tintColor: 'white'
    };

    let holeItems = [];
    let footerItems = []
    event.courseData.holes.map(hole => {
      const holeNr = hole.number;

      holeItems.push(
        <HoleView
          key={`hole_view_${hole.id}`}
          hole={hole}
          playing={playing}
          holesCount={event.courseData.holes_count}
          event={event}
          createEventScore={createEventScore}
          saveEventScore={saveEventScore}
        />
      )
    })

    return(
      <View style={[styles.container, {backgroundColor: '#F9F9F9'}]}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#0091e5'}}
          rightButton={rightButtonConfig} />

        <ScrollView
          ref={(scrollView) => { _scrollView = scrollView; }}
          showsHorizontalScrollIndicator={false}
          scrollEnabled={true}
          horizontal paging bounces pagingEnabled removeClippedSubviews>
          {holeItems}
        </ScrollView>
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
    saveEventScore: (eventId, playerId, eventScore, strokes, putts, points) => {
      dispatch(saveEventScore(eventId, playerId, eventScore, strokes, putts, points))
    },
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
