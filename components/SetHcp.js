'use strict';

import React, {
  Component,
  Text,
  TextInput,
  TouchableOpacity,
  ListView,
  View,
} from 'react-native';

import NavigationBar from 'react-native-navbar';

import styles from '../styles';

export default class SetHcp extends Component {
  constructor(props) {
    super(props);
    this.state = {strokes: 10};
  }

  render() {
    const { player, setHcp } = this.props;
    const { strokes } = this.state;

    const titleConfig = { title: 'Kolla HCP', tintColor: 'white'  };
    const rightButtonConfig = {
      title: '✓ OK',
      handler: () => setHcp(player.id, this.state.strokes),
      tintColor: 'white'
    };

    return(
      <View style={[styles.container, {backgroundColor: '#ccc'}]}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          rightButton={rightButtonConfig}
        />


        <View style={styles.card} key={`hcp_row_for_player_${player.id}`}>
          <View style={styles.cardTitle}>
            <Text style={styles.label}>Hur många slag har {player.name}?</Text>
            <TextInput
              style={styles.inputField}
              autoCapitalize="none"
              keyboardType="number-pad"
              ref="strokes"
              onChangeText={(strokes) => this.setState({strokes})}
              value={`${strokes}`}
            />
          </View>
        </View>
      </View>
    )
  }
}
