import React, {Component} from "react";
import {
  Alert, View, Text, TouchableOpacity, ScrollView, StatusBar
} from "react-native";

import NavigationBar from 'react-native-navbar';
import Drawer from 'react-native-drawer';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import HoleView from './HoleView';
import Loading from '../shared/Loading';
import ControlPanel from './ControlPanel';

import styles from '../../styles';
import realm from '../../realm';
import { apiUrl } from '../../lib/ApiService';

export default class ScoreEvent extends Component {
  constructor(props) {
    super(props);
    this.state = { hole: null };
    this.changeHole = this.changeHole.bind(this);
    this.saveRound = this.saveRound.bind(this);
  }

  openControlPanel() {
    this._drawer.open()
  }

  saveRound() {
    const { event, navigator, sessionToken } = this.props;
    const url = apiUrl + '/events/' + event.id;

    StatusBar.setNetworkActivityIndicatorVisible(true);

    const data = [];
    event.eventPlayers.map(p => {
      const playerData = {
        id: p.id,
        beers: p.beers,
        points: p.totalPoints,
        strokes: p.totalStrokes,
        scores: [],
      }
      p.eventScores.filtered('isScored == true').map(s => {
        playerData.scores.push({
          index: s.index,
          hole: s.hole,
          par: s.par,
          extraStrokes: s.extraStrokes,
          strokes: s.strokes,
          putts: s.strokes,
          points: s.points
        });
      });

      data.push(playerData);
    });

    fetch(url, {
      method: 'PUT',
      crossOrigin: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${sessionToken}`
      },
      body: JSON.stringify({players: data})
    })
    .then((response) => {
      return response.json()
    })
    .then((event) => {
      realm.write(() => {
        realm.create('Event', {
          id: event.id,
          status: event.status,
          isScoring: false,
          currentHole: 0
        }, true);
      });
      requestAnimationFrame(() => navigator.resetTo({ tab: 'leaderboard' }));
      StatusBar.setNetworkActivityIndicatorVisible(false);
    }).catch((error) => {
      StatusBar.setNetworkActivityIndicatorVisible(false);
      alert('Kunde inte spara runda, Var god se över informationen');
      console.log('Error retreiving data', error);
    })
  }

  componentWillMount() {
    const { event } = this.props
    const hole = event.course.holes.find(h => h.number === event.currentHole);
    this.setState({ hole });
  }

  changeHole(newHoleNr) {
    const { event } = this.props;
    const oldHoleNr = event.currentHole;
    realm.write(() => {
       event.currentHole = newHoleNr;
    });
    const hole = event.course.holes.find(h => h.number === newHoleNr);
    this._drawer.close();
    this.setState({ hole });
  }

  render() {
    const { event, navigator } = this.props;
    const { hole } = this.state;

    const titleConfig = { title: event.course.name, tintColor: 'white'  };
    const rightButtonConfig = {
      title: <Icon name="pencil-square-o" size={20} />,
      handler: () => requestAnimationFrame(() => navigator.push({showScorecard: 1, event})),
      tintColor: 'white'
    };
    const leftButtonConfig = {
      title: <Icon name="th" size={20} />,
      handler: () => this.openControlPanel(),
      tintColor: 'white'
    }

    if(hole) {

      let prevHole;
      if(hole.number > 1) {
        const newHoleNr = hole.number -1;
        prevHole = (
          <TouchableOpacity
            style={styles.holeSwitchButton}
            onPress={() => this.changeHole(newHoleNr)}>
            <Text style={styles.holeSwitchButtonLabel}>← HÅL {newHoleNr}</Text>
          </TouchableOpacity>
        );
      }

      let nextHole;
      if(hole.number !== event.course.holes_count) {
        const newHoleNr = hole.number + 1;
        nextHole = (
          <TouchableOpacity
            style={[styles.holeSwitchButton]}
            onPress={() => this.changeHole(newHoleNr)}>
            <Text style={styles.holeSwitchButtonLabel}>HÅL {newHoleNr} →</Text>
          </TouchableOpacity>
        );
      } else if(hole.number === event.course.holes_count) {
        nextHole = (
          <TouchableOpacity
            style={[styles.holeSwitchButton, {backgroundColor: 'green'}]}
            onPress={() => this.saveRound()}>
            <Text style={[styles.holeSwitchButtonLabel, {color: '#fff'}]}>SPARA RUNDA</Text>
          </TouchableOpacity>
        );
      }

      return(
        <Drawer
          ref={(ref) => this._drawer = ref}
          openDrawerOffset={0.1}
          panCloseMask={0.1}
          tweenHandler={Drawer.tweenPresets.parallax}
          tapToClose={true}
          content={
            <ControlPanel
              event={event}
              navigator={navigator}
              onSelectHole={this.changeHole}/>
          }>

          <View style={styles.container}>
            <NavigationBar
              style={styles.header}
              title={titleConfig}
              statusBar={{style: 'light-content', tintColor: '#477dca'}}
              leftButton={leftButtonConfig}
              rightButton={rightButtonConfig} />


            <HoleView
              key={`hole_view_${hole.id}`}
              hole={hole}
              event={event} />

            <View style={styles.bottomBar}>
              {prevHole}
              {nextHole}
            </View>
          </View>
        </Drawer>
      );
    } else {
      return <Loading />;
    }
  }
}
