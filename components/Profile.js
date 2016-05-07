'use strict';

import React, {
  Component,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import styles from '../styles';

import NavigationBar from 'react-native-navbar';

export default class Profile extends Component {
  render() {
    const { currentUser, onLogout, dispatch } = this.props;
    const titleConfig = { title: currentUser.name, tintColor: 'white'  };
    const leftButtonConfig = {
      title: 'Stäng',
      handler: () => dispatch({ type: 'back' }),
      tintColor: 'white'
    };
    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig} />

          <TouchableOpacity onPress={onLogout} style={styles.btn}>
            <Text style={styles.btnLabel}> LOGGA UT </Text>
          </TouchableOpacity>
      </View>
    )
  }
}
