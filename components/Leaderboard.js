'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  View,
  Modal,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import Profile from './Profile';
import Events from './Events';
import Icon from 'react-native-vector-icons/Ionicons';

export default class Leaderboard extends Component {
  constructor(props) {
    super(props);
    this.state = { profileVisible: false };
    this.onLogout = this.props.onLogout;
  }

  toggleProfile(visible) {
    this.setState({profileVisible: visible});
  }

  render() {
    const { currentUser } = this.props;
    const { profileVisible } = this.state;
    const titleConfig = { title: 'Tisdagsgolfen', tintColor: 'white' };
    const leftButton = (
      <Icon style={[styles.headerBtn, styles.leftBtn]}
            name="person" size={26}
            onPress={() => this.props.navigator.push({
              component: Profile,
              passProps: {
                currentUser: currentUser,
                onLogout: this.onLogout
              },
              type: 'Modal'
            })}/>
    );
    const rightButton = (
      <Icon style={[styles.headerBtn, styles.rightBtn]}
            name="calendar" size={26}
            onPress={() => this.props.navigator.push({
              component: Events
            })}/>
    );

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          title={titleConfig}
          leftButton={leftButton}
          rightButton={rightButton} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#faf8e0',
    flex: 1
  },
  headerBtn: {
    marginTop: 20,
    color: '#eee'
  },
  leftBtn: {
    marginLeft: 20,
  },
  rightBtn: {
    marginRight: 20
  },
  header: {
    height: 60,
    backgroundColor: '#477dca'
  }
});
