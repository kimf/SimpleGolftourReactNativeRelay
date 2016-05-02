'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import NavigationBar from 'react-native-navbar';

export default class ScoreEvent extends Component {

  render() {
    const { currentUser, event, dispatch } = this.props;
    const titleConfig = { title: 'Choose Players/Team', tintColor: 'white'  };
    const leftButtonConfig = {
      title: '< Back',
      handler: () => dispatch({ type: 'back' }),
      tintColor: 'white'
    };
    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
        />
        <View style={styles.container}>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ccc',
    flex: 1
  },
  header: {
    height: 60,
    backgroundColor: '#477dca'
  },
});
