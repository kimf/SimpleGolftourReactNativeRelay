import React, {Component} from "react";
import {StatusBar, Text, View} from "react-native";

import realm from '../realm';
import { courseApiUrl } from '../lib/ApiService';
import styles from '../styles';

export default class Login extends Component {
  componentWillMount() {
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
          }, true);
        });
      });
      this.props.onDone();
    }).catch((error) => {
      this.props.onDone();
      console.log('Error retreiving data', error);
    })
  }

  render() {
    return(
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Text style={{padding: 40, marginTop: 100, fontSize: 30, fontWeight: 'bold'}}>
          Laddar banor...
        </Text>
      </View>
    )
  }
}
