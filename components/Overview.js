'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import Profile from './Profile';

export default class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = { modalVisible: false };
    this.onCloseModal = this.closeModal.bind(this);
    this.onLogout = this.props.onLogout;
  }

  closeModal() {
    this.setState({modalVisible: false});
  }

  showModal() {
    this.setState({modalVisible: true});
  }

  render() {
    const { currentUser } = this.props;
    const { modalVisible } = this.state;
    const titleConfig = { title: 'Overview' };
    const rightButtonConfig = {
      title: 'Profile',
      handler: () => {
        this.showModal();
      }
    };
    return(
      <View style={styles.container}>
        <NavigationBar
          title={titleConfig}
          rightButton={rightButtonConfig} />
        {currentUser.tours.map(tour => (
          <Text key={`tour-${tour.id}`}>
            {tour.name}
          </Text>
        ))}
        <Profile
          currentUser={currentUser}
          visible={modalVisible}
          onClose={this.onCloseModal}
          onLogout={this.onLogout} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#faf8e0',
    flex: 1
  },
});
