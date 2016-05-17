import React, {Component} from "react";
import {View, Text, TouchableOpacity} from "react-native";
import styles from '../../styles';
import realm from '../../realm';

export default class SaveRoundView extends Component {
  constructor(props) {
    super(props);
    this.saveRound = this.saveRound.bind(this);
  }

  saveRound() {
    const { event, sessionToken } = this.props;
  }

  render(){
    const { event } = this.props;
    return(
      <View>
        <View style={styles.inlineHeader}>
          <Text style={[styles.holeHeaderText]}>
            SPARA RUNDA
          </Text>
        </View>
        <Text style={styles.centerText, styles.flexOne}>
          Kolla så att allt stämmer, annars får du scrolla tillbaka och ändra!
        </Text>

        <View style={styles.scoreHeaderRow}>
          <Text style={styles.scoreHeaderPlayer}>SPELARE</Text>
          <Text style={styles.scoreHeader}>SLAG</Text>
          <Text style={styles.scoreHeader}>PUTTAR</Text>
          <Text style={[styles.scoreHeader]}>POÄNG</Text>
        </View>
      </View>
    )
  }
}
