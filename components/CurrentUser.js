'use strict';

import Relay from 'react-relay';

import React, {
  Component,
  Navigator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import Leaderboard from './Leaderboard';

class CurrentUser extends Component {
  renderScene(route, navigator) {
    return React.createElement(
      route.component,
      { ...this.props, ...route.passProps, route, navigator }
    )
  }

  configureScene(route, routeStack){
    if(route.type == 'Modal') {
      return Navigator.SceneConfigs.FloatFromBottom
    }
    return Navigator.SceneConfigs.PushFromRight
  }

  render() {
    const { currentUser } = this.props;

    const initialRoute = {
      component: Leaderboard,
      passProps: {
        currentUser: currentUser
      }
    }

    return (
      <View style={styles.container}>
        <Navigator
          configureScene={ this.configureScene }
          initialRoute={initialRoute}
          renderScene={this.renderScene}
        />
      </View>
    )
  }
}

export default Relay.createContainer(CurrentUser, {
  fragments: {
    currentUser: () => Relay.QL`
      fragment on User {
        id,
        name,
        email
      }
    `
  }
});


const styles = StyleSheet.create({
  container: {
    backgroundColor: '#faf8e0',
    flex: 1
  }
});
