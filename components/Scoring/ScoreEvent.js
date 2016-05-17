import React, {Component} from "react";
import {
  Alert, View, Text, TouchableOpacity, ScrollView, StatusBar, InteractionManager
} from "react-native";

import NavigationBar from 'react-native-navbar';
import SwipeableViews from 'react-swipeable-views/lib/index.native.animated';
//import SwipeableViews from 'react-swipeable-views/lib/index.native.scroll';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import HoleView from './HoleView';
import Loading from '../shared/Loading';

import styles from '../../styles';
import realm from '../../realm';

export default class ScoreEvent extends Component {
  constructor(props) {
    super(props);
    this.state = { currentIndex: props.event.currentHole -1 };
    this.changeHole = this.changeHole.bind(this);
  }

  changeHole(index) {
    const { event } = this.props;
    InteractionManager.runAfterInteractions(() => {
      realm.write(() => {
         event.currentHole = index + 1;
      });
    });
  }

  render() {
    const { event, navigator, sessionToken } = this.props;
    const { currentIndex } = this.state;

    const titleConfig = { title: event.course.name, tintColor: 'white'  };
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
          index={currentIndex}
          onChangeIndex={this.changeHole}
          autoplay={false}

          resistance>
          {event.course.holes.sorted('number').map((hole) => {
            return(
              <HoleView
                key={`hole_view_${hole.id}`}
                hole={hole}
                event={event}
                sessionToken={sessionToken} />
            )
          })}
        </SwipeableViews>
      </View>
    );
  }
}
