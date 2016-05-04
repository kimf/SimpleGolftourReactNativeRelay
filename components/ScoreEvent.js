import React, {
  Component,
  View,
  TouchableOpacity,
  ListView,
  Text
} from 'react-native';

import NavigationBar from 'react-native-navbar';

const styles = require('../styles.js');

export default class ScoreEvent extends Component {
  constructor(props) {
    super(props);

    const currentPlayers = []
    for (let player of props.currentUser.leaderboard) {
      if(props.players.indexOf(player.id) !== -1) {
        currentPlayers.push({
          id: player.id,
          name: player.name
        });
      }
    }

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      players: currentPlayers,
      dataSource: ds.cloneWithRows(currentPlayers)
    };
  }

  _renderRow(rowData) {
    return (
      <TouchableOpacity onPress={() => this._selectPlayer(rowData.id)}>
        <View style={styles.card}>
          <Text>{rowData.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { currentUser, event } = this.props;
    const { players, dataSource } = this.state;

    const titleConfig = { title: 'Hål 1', tintColor: 'white'  };

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
        />
        <ListView
          dataSource={dataSource}
          renderRow={this._renderRow}
        />
      </View>
    )
  }
}
