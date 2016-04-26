import React, {
  Component,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class Tour extends Component {
  render() {
    const { tour } = this.props;
    return(
      <View>
        <View key='leaderboard-header' style={styles.tableheader}>
          <Text style={[styles.cell, styles.th, styles.id]}>#</Text>
          <Text style={[styles.cell, styles.th, styles.name]}>Name</Text>
          <Text style={[styles.cell, styles.th, styles.events]}>Events</Text>
          <Text style={[styles.cell, styles.th, styles.average]}>Average</Text>
          <Text style={[styles.cell, styles.th, styles.points]}>Points</Text>
        </View>
        <ScrollView>
           {tour.currentSeason.leaderboard.map(user =>
             <View key={user.id} style={styles.tablerow}>
               <Text style={[styles.cell, styles.td, styles.id]}>{user.position}</Text>
               <Text style={[styles.cell, styles.td, styles.name]}>{user.name}</Text>
               <Text style={[styles.cell, styles.td, styles.events]}>{user.num_events}</Text>
               <Text style={[styles.cell, styles.td, styles.average]}>{user.average}</Text>
               <Text style={[styles.cell, styles.td, styles.points]}>{user.total_points}</Text>
             </View>
           )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  tableheader: {
    backgroundColor: '#ccc',
    flexDirection: 'row'
  },

  tablerow: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
  },

  cell: {
    padding: 5,
    alignItems: 'flex-start'
  },

  th: {
    fontSize: 12,
    color: '#444'
  },

  td: {
    paddingTop: 12,
    paddingBottom: 12
  },

  id: {
    width: 30,
    textAlign: 'right'
  },

  name: {
    width: 150,
    paddingLeft: 10
  },

  events: {
    width: 60
  },

  average: {
    width: 60
  },

  points: {
    width: 60,
    fontWeight: 'bold'
  }
});
