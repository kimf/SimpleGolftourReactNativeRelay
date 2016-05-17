import React, {Component} from "react";
import {
  Alert, View, Text, TouchableOpacity, ScrollView, StatusBar, InteractionManager
} from "react-native";

import NavigationBar from 'react-native-navbar';
import SwipeableViews from 'react-swipeable-views/lib/index.native.animated';
//import SwipeableViews from 'react-swipeable-views/lib/index.native.scroll';
import Icon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';

import SaveRoundView from './SaveRoundView';
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
    realm.write(() => {
       event.currentHole = index + 1;
    });
    this.setState({currentIndex: index});
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

    console.log(currentIndex);

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
          <SaveRoundView event={event} sessionToken={sessionToken} />
        </SwipeableViews>

        <View style={{height: 20}}>
          <View style={{flexDirection: 'row', flex: 1, alignItems: 'flex-start'}}>
          {event.course.holes.sorted('number').map((hole) => {
            let activeStyle;
            if(hole.number === (currentIndex + 1)){
              activeStyle = {color: '#fff', backgroundColor: '#444'}
            }

            return (
                <TouchableOpacity key={`hole_button_${hole.id}`} style={[{flex: 1}]} onPress={() => this.changeHole(hole.number - 1)}>
                  <Text style={[activeStyle, {fontSize: 10, padding: 3, color: '#ccc', textAlign: 'center'}]}>{hole.number}</Text>
                </TouchableOpacity>
            )
          })}
          </View>
        </View>
      </View>
    );
  }
}
