'use strict';

import React, {Component} from "react";
import {Text, TextInput, TouchableOpacity, View, ListView} from "react-native";
import NavigationBar from 'react-native-navbar';
//import Search from 'react-native-search-bar';

import styles from '../../styles';

import clubsJson from '../../../lib/clubs.json';

export default class SetCourse extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged           : (row1, row2) => row1 !== row2,
      sectionHeaderHasChanged : (s1, s2) => s1 !== s2
    })

    this.sections = {}
    let clubName = '';
    clubsJson.clubs.map(c => {
      let courses = {};
      if(c.courses.length === 0) { return false };
      clubName = c.name;
      c.courses.map((co) => {
        co.clubName = clubName;
        courses[co.name] = co;
      });
      this.sections[c.name] = courses;
    })

    this.state = {
      dataSource: ds.cloneWithRowsAndSections(this.sections),
      query: ''
    }

    this.renderRow = this._renderRow.bind(this);
    this.renderHeader = this._renderHeader.bind(this);
    this.renderSectionHeader = this._renderSectionHeader.bind(this);
    this.close = this.close.bind(this);
    this.chooseCourse = this.chooseCourse.bind(this);
    this.setSearchQuery = this.setSearchQuery.bind(this);
  }

  _renderSectionHeader(sectionData, sectionID) {
    return (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionHeaderText}>{sectionID}</Text>
      </View>
    )
  }

  setSearchQuery(query) {
    const { dataSource, sections } = this.state;
    let newDataSource = null;
    if(query !== null && query.length > 1) {
      const q = query.toLowerCase();
      const filtered = new Object();
      for (let i in this.sections) {
        if (i.toLowerCase().indexOf(q) !== -1) {
          filtered[i] = this.sections[i];
        }
      }
      newDataSource = dataSource.cloneWithRowsAndSections(filtered);
    } else {
      newDataSource = dataSource.cloneWithRowsAndSections(this.sections);
    }
    this.setState({ dataSource: newDataSource, query });
  }

  close() {
    const { navigator } = this.props;
    if (navigator) {
      requestAnimationFrame(() => navigator.pop());
    }
  }

  chooseCourse(course) {
    const { navigator } = this.props;
    if (navigator) {
      requestAnimationFrame(() => navigator.push({
        newEvent: 1,
        course: course
      }));
    }
  }

  _renderRow(course, sectionID, rowID, highlightRow) {
    const { navigator } = this.props;
    return(
      <TouchableOpacity
        onPress={() => this.chooseCourse(course)}
        key={`course_row_${course.id}`}>
        <View style={styles.courserow}>
          <Text>{course.name} {course.par}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  _renderHeader() {

  }

  render() {
    const { query, dataSource } = this.state;

    const titleConfig = { title: 'Välj Bana', tintColor: 'white'  };

    const leftButtonConfig = {
      title: 'Avbryt',
      handler: this.close,
      tintColor: 'white'
    };

    return(
      <View style={[styles.container]}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#0091e5'}}
          leftButton={leftButtonConfig}
        />
        <View style={styles.inlineHeader}>
          <TextInput
            style={styles.inputField}
            autoCapitalize="words"
            autoCorrect={false}
            placeholder="Sök klubb"
            ref= "query"
            returnKeyType="search"
            onChangeText={(query) => this.setSearchQuery(query)}
            value={query}
          />
        </View>
        <ListView
          dataSource={dataSource}
          renderHeader={this.renderHeader}
          renderRow={this.renderRow}
          renderSectionHeader={this.renderSectionHeader}
        />
      </View>
    )
  }
}
