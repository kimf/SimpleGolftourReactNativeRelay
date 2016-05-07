'use strict';

import React, {
  Component,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { ListView } from 'realm/react-native';
import NavigationBar from 'react-native-navbar';

import styles from '../styles';

export default class SetCourse extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(props.clubs)
    };
    this._renderRow = this._renderRow.bind(this);
  }

  _renderRow(club) {
    const { setCourse } = this.props;
    return(
      <View key={`club_row_${club.id}`} style={[styles.card, {flexDirection: 'column'}]}>
        <Text>{club.name}</Text>
        {club.courses.map((course) => {
          return(
            <TouchableOpacity onPress={() => setCourse(course)} key={`course_row_${course.id}`}>
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
    const { clubs, setCourse } = this.props;
    const { dataSource } = this.state;

    const titleConfig = { title: 'Välj Bana', tintColor: 'white'  };

    const leftButtonConfig = {
      title: '< Bakåt',
      handler: () => setCourse(null),
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
