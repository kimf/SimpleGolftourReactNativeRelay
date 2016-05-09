import React, {Component} from "react";
import {View, Text} from "react-native";

import NavigationBar from 'react-native-navbar';
import SwipeableViews from 'react-swipeable-views/lib/index.native.animated';
import Collapsible from 'react-native-collapsible';

import HoleView from './HoleView';
import Loading from './Loading';
import Scorecard from './Scorecard';

import styles from '../styles';
import realm from '../realm';

export default class ScoreEvent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentHoleNr: props.event.currentHole,
      scorecardCollapsed: false
    }
    this.onChangeIndex = this._onChangeIndex.bind(this);
  }

  // componentWillMount() {
  //   realm.addListener('change', () => {
  //     this.forceUpdate();
  //   });
  // }

  // componentWillUnMount() {
  //   realm.removeAllListeners();
  // }

  _onChangeIndex(index, fromIndex) {
    realm.write(() => {
      this.props.event.currentHole = index + 1;
    });
  }


  render() {
    const { event, dispatch } = this.props;
    const { currentHoleNr, scorecardCollapsed} = this.state;

    const titleConfig = { title: event.course.name, tintColor: 'white'  };
    const rightButtonConfig = {
      title: 'Scorekort',
      handler: () => this.setState({ scorecardCollapsed: !scorecardCollapsed }),
      tintColor: 'white'
    };

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          rightButton={rightButtonConfig} />
        <Collapsible collapsed={scorecardCollapsed} >
          <Scorecard event={event} />
        </Collapsible>
        <SwipeableViews
          autoplay={false}
          style={styles.wrapper}
          showsButtons={true}
          loop={false}
          index={currentHoleNr-1}
          resistance={true}
          onChangeIndex={this.onChangeIndex}
        >
          {event.course.holes.sorted('number').map((hole) => {
            return(
              <HoleView key={`hole_view_${hole.id}`} hole={hole} event={event} />
            );
          })}
        </SwipeableViews>
      </View>
    );
  }
}
