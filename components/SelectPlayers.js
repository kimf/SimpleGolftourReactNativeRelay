'use strict';

import React, {
  Component,
  StyleSheet,
  Text,
  TouchableOpacity,
  ListView,
  View,
} from 'react-native';

import NavigationBar from 'react-native-navbar';

export default class SelectPlayers extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const selectedPlayers = [props.currentUser.id];
    this.state = {
      selectedPlayers: selectedPlayers,
      dataSource: ds.cloneWithRows(this._genRows(selectedPlayers))
    };
    this._renderRow = this._renderRow.bind(this);
  }

  _genRows(selectedPlayers) {
    const { leaderboard } = this.props.currentUser;

    var rows = [];
    for (var val of leaderboard) {
      if(selectedPlayers.indexOf(val.id) !== -1) {
        val.selected = true;
      } else {
        val.selected = false;
      }
      rows.push(JSON.parse(JSON.stringify(val)));
    }

    return rows;
  }

  _selectPlayer(playerId) {
    const { selectedPlayers, dataSource } = this.state;
    const { currentUser } = this.props

    if (playerId === currentUser.id) {
      return false;
    }

    const index = selectedPlayers.indexOf(playerId);
    if(index !== -1) {
      selectedPlayers.splice(index, 1);
    } else {
      selectedPlayers.push(playerId);
    }

    const newDataSource = dataSource.cloneWithRows(
      this._genRows(selectedPlayers)
    );
    this.setState({selectedPlayers: selectedPlayers, dataSource: newDataSource});
  }

  _renderRow(rowData) {
    return (
      <TouchableOpacity onPress={() => this._selectPlayer(rowData.id)}>
        <View style={styles.card}>
          <Text style={rowData.selected ? styles.selected : null}>{rowData.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }

  render() {
    const { event, dispatch } = this.props;
    const { selectedPlayers, dataSource } = this.state;

    const titleConfig = { title: 'Välj Spelare/Lag', tintColor: 'white'  };
    const leftButtonConfig = {
      title: '< Bakåt',
      handler: () => dispatch({ type: 'back' }),
      tintColor: 'white'
    };
    const rightButtonConfig = {
      title: '+ Ny',
      handler: () => dispatch({ type: 'newPlayer' }),
      tintColor: 'white'
    };

    return(
      <View style={styles.container}>
        <NavigationBar
          style={styles.header}
          title={titleConfig}
          statusBar={{style: 'light-content', tintColor: '#477dca'}}
          leftButton={leftButtonConfig}
          rightButton={rightButtonConfig}
        />
        <ListView
          dataSource={dataSource}
          renderRow={this._renderRow}
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={() => dispatch({ type: 'scoreEvent', event: event, players: selectedPlayers })}>
          <Text style={styles.btnLabel}>STARTA RUNDA</Text>
        </TouchableOpacity>
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
  card: {
    borderBottomWidth: 1,
    borderColor: '#cecece',
    flexDirection: 'row',
    padding: 5,
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 10,
    marginTop: 10,
  },
  btn: {
    marginTop: 10,
    padding: 20,
    paddingLeft: 60,
    paddingRight: 60,
    backgroundColor: 'green',
  },
  btnLabel: {
    textAlign: 'center',
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
  },
  selected: {
    color: 'green',
    fontWeight: 'bold'
  }
});
