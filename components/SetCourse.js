'use strict';

import React, {Component} from "react";
import {Text, TouchableOpacity, View} from "react-native";

import { ListView } from 'realm/react-native';
import NavigationBar from 'react-native-navbar';

import styles from '../styles';
import realm from '../realm';

export default class SetCourse extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.clubs = realm.objects('Club').sorted('name');
    this.state = {
      dataSource: ds.cloneWithRows(this.clubs)
    };
    this._renderRow = this._renderRow.bind(this);
  }

  _renderRow(club) {
    const { dispatch } = this.props;
    return(
      <View key={`club_row_${club.id}`} style={[styles.card, {flexDirection: 'column'}]}>
        <Text>{club.name}</Text>
        {club.courses.map((course) => {
          return(
            <TouchableOpacity
              onPress={() => dispatch({ type: 'setCourse', course: course })}
              key={`course_row_${course.id}`}>
              <View style={styles.card}>
                <Text>{course.name} {course.par}</Text>
              </View>
            </TouchableOpacity>
          )
        })}
      </View>
    )
  }

  render() {
    const { dispatch } = this.props;
    const { dataSource } = this.state;

    const titleConfig = { title: 'Välj Bana', tintColor: 'white'  };

    const leftButtonConfig = {
      title: '< Bakåt',
      handler: () => dispatch({ type: 'back' }),
      tintColor: 'white'
    };

    return(
      <View style={[styles.container]}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
        />
        <ListView
          dataSource={dataSource}
          renderRow={this._renderRow}
        />
      </View>
    )
  }
}
