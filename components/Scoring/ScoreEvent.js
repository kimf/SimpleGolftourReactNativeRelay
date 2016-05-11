import React, {Component} from "react";
import {View, Text} from "react-native";

import NavigationBar from 'react-native-navbar';
import SwipeableViews from 'react-swipeable-views/lib/index.native.animated';

import HoleView from './HoleView';
import Loading from '../shared/Loading';

import styles from '../../styles';
import realm from '../../realm';

export default class ScoreEvent extends Component {
  constructor(props) {
    super(props);
    this.state = { hole: null };
    this.onChangeIndex = this._onChangeIndex.bind(this);
  }

  componentDidMount() {
    const { event } = this.props
    const hole = event.course.holes.find(h => h.number === event.currentHole + 1);
    this.setState({ hole });
  }

  _onChangeIndex(index, fromIndex) {
    realm.write(() => {
      this.props.event.currentHole = index + 1;
    });
  }


  render() {
    const { event, dispatch } = this.props;
    const { hole } = this.state;

    const titleConfig = { title: event.course.name, tintColor: 'white'  };
    const rightButtonConfig = {
      title: 'Scorekort',
      handler: () => dispatch({ type: 'showScorecard' }),
      tintColor: 'white'
    };

    if(hole) {
      return(
        <View style={styles.container}>
          <NavigationBar
            style={styles.header}
            title={titleConfig}
            statusBar={{style: 'light-content', tintColor: '#477dca'}}
            rightButton={rightButtonConfig} />

          <HoleView key={`hole_view_${hole.id}`} hole={hole} event={event} />
        </View>
      );
    } else {
      return <Loading />;
    }
  }
}
