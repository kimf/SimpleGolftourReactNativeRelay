'use strict';

import React, {
  Modal,
  Component,
  Text,
  TouchableOpacity,
  ListView,
  View,
} from 'react-native';

import NavigationBar from 'react-native-navbar';
import SetHcp from './SetHcp';

const styles = require('../styles.js');

export default class SelectPlayers extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const selectedPlayers = [];
    this.state = {
      selectedPlayers: selectedPlayers,
      dataSource: ds.cloneWithRows(this._genRows(selectedPlayers)),
      modalVisible: false
    };
    this._renderRow = this._renderRow.bind(this);
    this._setHcp = this._setHcp.bind(this);
  }

  _genRows(selectedPlayers) {
    const { leaderboard } = this.props.currentUser;
    var rows = [];
    for (var val of leaderboard) {
      if(selectedPlayers.filter(sel => sel.playerId === val.id).length === 1) {
        val.selected = true;
      } else {
        val.selected = false;
      }
      rows.push(JSON.parse(JSON.stringify(val)));
    }

    return rows;
  }

  _selectPlayer(playerId) {
    const { selectedPlayers } = this.state;
    const alreadySelected = selectedPlayers.findIndex(sel => sel.playerId === playerId);
    if(alreadySelected !== -1) {
      selectedPlayers.splice(alreadySelected, 1);
      this._reRenderSelections(selectedPlayers);
    } else {
      const { dispatch, currentUser } = this.props;
      const selectedPlayer = currentUser.leaderboard.filter(player => player.id === playerId)[0];
      this.setState({modalVisible: true, selectedPlayer: selectedPlayer});
    }
  }

  _setHcp(playerId, hcp, strokes) {
    const { selectedPlayers } = this.state;
    selectedPlayers.push({ playerId, hcp, strokes });
    this._reRenderSelections(selectedPlayers);
  }

  _reRenderSelections(selectedPlayers) {
    const newDataSource = this.state.dataSource.cloneWithRows(
      this._genRows(selectedPlayers)
    );

    this.setState({
      modalVisible: false,
      selectedPlayers: selectedPlayers,
      dataSource: newDataSource
    });
  }

  _renderRow(rowData) {
    const { selectedPlayers } =  this.state;
    let selIndex = selectedPlayers.findIndex(sel => sel.playerId === rowData.id);

    let hcpData;
    let checkmark;

    if(selIndex !== -1){
      const selPlayerData = selectedPlayers[selIndex];
      hcpData = <Text style={styles.strokeInfo}>Hcp: {selPlayerData.hcp} • Slag: {selPlayerData.strokes}</Text>;
      checkmark = <Text style={styles.checkmark}>✓</Text>;
    }
    return (
      <TouchableOpacity style={styles.card} onPress={() => this._selectPlayer(rowData.id)}>
        <Text style={[styles.flexOne, (rowData.selected ? styles.selected : styles.blank)]}>
          {checkmark}
          {rowData.name}
        </Text>
        {hcpData}
      </TouchableOpacity>
    );
  }

  render() {
    const { event, dispatch } = this.props;
    const { selectedPlayers, dataSource, modalVisible, selectedPlayer } = this.state;

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
        <View style={styles.inlineHeader}>
          <Text style={[styles.centerText, styles.boldText]}>{event.course}</Text>
        </View>
        <ListView
          dataSource={dataSource}
          renderRow={this._renderRow}
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={() => dispatch({ type: 'scoreEvent', event: event, players: selectedPlayers })}>
          <Text style={styles.btnLabel}>BÖRJA SPELA</Text>
        </TouchableOpacity>

        <Modal
          animated={true}
          transparent={false}
          visible={modalVisible}
          >
          <SetHcp player={selectedPlayer} setHcp={this._setHcp} />
        </Modal>
      </View>
    )
  }
}
