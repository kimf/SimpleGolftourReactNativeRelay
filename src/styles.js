'use strict';

import {
  Platform,
  StyleSheet
} from 'react-native';

import colors from './colors';

// const { NavBarHeight, TotalNavHeight } = Navigator.NavigationBar.Styles.General;
// const iOS = (Platform.OS == 'ios');
// fontSize: iOS ? 12 : 11,


export default StyleSheet.create({
  /* MAIN LAYOUT PARTS */
  container: {
    backgroundColor: '#fff',
    alignItems: 'stretch',
    flex: 1
  },

  header: {
    height: 60,
    backgroundColor: colors.blue,
  },

  inlineHeader: {
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: colors.inactiveText,
  },

  listrow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cellBorder,
    flexDirection: 'row',
    padding: 10
  },

  bottomBar: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#eee',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

  bottomBarBtn: {
    flex: 2,
    height: 40,
    margin: 5,
    padding: 10,
    backgroundColor: colors.actionText,
  },

  formRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cellBorder,
    flexDirection: 'column',
    padding: 10,
    marginTop: 10,
  },

  formColumn: {
    flex: 1,
    padding: 10,
  },

  formColumnContent: {
    paddingTop: 5,
    paddingBottom: 5,
    marginTop: 5,
    marginLeft: 10
  },

  inlineBtn: {
    marginTop: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#000',
    color: '#fff',
    textAlign: 'center',
  },

  btn: {
    margin: 10,
    padding: 20,
    backgroundColor: 'green',
  },

  btnLabel: {
    textAlign: 'center',
    flex: 1,
    color: 'white',
    fontFamily: 'Avenir',
    fontWeight: 'bold',
  },

  points: {
    fontFamily: 'Avenir',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1
  },

  position: {
    marginRight: 5,
    width: 40,
    flexDirection: 'column',
  },

  cardTitle: {
    flex: 5,
    flexDirection: 'column',
  },

  meta: {
    fontFamily: 'Avenir',
    color: '#777',
    flex: 1,
    fontSize: 12,
    marginTop: 3,
  },

  name: {
    fontFamily: 'Avenir',
    fontWeight: 'bold',
    flex: 1,
    fontSize: 14,
  },

  label: {
    fontFamily: 'Avenir',
    marginTop: 10,
    marginLeft: 10,
    color: '#444',
    fontSize: 16,
  },

  inputField: {
    fontFamily: 'Avenir',
    padding: 5,
    margin: 10,
    height: 40,
    backgroundColor: 'white',
    fontSize: 16,
  },

  datePickerContainer: {
    backgroundColor: '#fff',
    borderTopColor: '#ccc',
    borderTopWidth: StyleSheet.hairlineWidth
  },

  danger: {
    backgroundColor: 'red'
  },

  success: {
    backgroundColor: 'green'
  },

  scoring: {
    backgroundColor: colors.cellBorder,
  },

  playerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },

  playerName: {
    flex: 2,
    paddingTop: 10
  },

  playerHoleData: {
    fontFamily: 'Avenir',
    flex: 1,
    flexDirection: 'row',
    color: '#ccc',
    fontSize: 28,
    fontWeight: 'bold'
  },

  scorebox: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 20,
    paddingTop: 20
  },

  picker: {
    flex: 1
  },

  scorecardRowPoints: {
    color: '#000',
    fontFamily: 'Avenir',
  },

  centerText: {
    textAlign: 'center'
  },

  boldText: {
    fontWeight: 'bold'
  },

  flexOne: {
    flex: 1
  },

  flexTwo: {
    flex: 2
  },

  inlineInput: {
    padding: 2,
    margin: 5,
    height: 30,
    backgroundColor: 'white',
    borderColor: '#ccc',
    borderWidth: StyleSheet.hairlineWidth,
    fontSize: 14,
    flex: 1,
    fontFamily: 'Avenir',
  },

  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
    fontFamily: 'Avenir',
  },

  strokeInfo: {
    flex: 1,
    textAlign: 'right',
    fontFamily: 'Avenir',
  },

  smallLabel: {
    fontSize: 10,
    fontFamily: 'Avenir',
  },

  scoredEventBtn: {
    backgroundColor: 'red',
    marginTop: 10,
    padding: 5,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Avenir',
  },

  todayBtn: {
    backgroundColor: 'green',
    marginTop: 10,
    padding: 10,
    marginBottom: 10,
    color: '#fff',
    textAlign: 'center',
    fontFamily: 'Avenir',
  },

  holeHeaderText: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Avenir',
  },

  inlineButton: {
    padding: 10,
    backgroundColor: '#feb',
    fontFamily: 'Avenir',
  },

  holeSwitchButton: {
    flex: 1,
    height: 40,
    margin: 5,
    padding: 10,
    backgroundColor: '#ccc',
  },

  holeSwitchButtonLabel: {
    textAlign: 'center',
    color: '#444',
    fontFamily: 'Avenir',
  },

  cellStyle: {
    padding: 5,
    flex: 1,
    fontWeight: 'bold',
    color: '#444',
    backgroundColor: '#ccc',
    fontSize: 10,
    margin: 1,
    height: 30,
    width: 60,
    textAlign: 'center',
    fontFamily: 'Avenir',
  },

  cellStyleScore: {
    height: 30,
    width: 30,
    textAlign: 'center',
    padding: 5,
    flex: 1,
    margin: 1,
    color: '#444',
    backgroundColor: '#eee',
    fontSize: 12,
    fontFamily: 'Avenir',
  },

  playerHeaderCellStyle: {
    height: 30,
    textAlign: 'center',
    backgroundColor: '#eee',
    marginTop: 5,
    fontFamily: 'Avenir',
  },

  emptyCellStyle: {
    backgroundColor: 'transparent',
    height: 30,
    width: 0,
    marginTop: 5
  },

  playerNameCell: {
    fontSize: 10,
    fontFamily: 'Avenir',
  },

  scoreHeaderRow: {
    backgroundColor: '#eee',
    flexDirection: 'row',
    padding: 5
  },

  scoreHeader: {
    width: 70,
    textAlign: 'right',
    padding: 5,
    color: '#787878',
    fontFamily: 'Avenir',
  },

  scoreHeaderPlayer: {
    flex: 3,
    padding: 5,
    color: '#787878',
    fontFamily: 'Avenir',
  },

  largeText: {
    fontFamily: 'Avenir',
    fontSize: 28
  },

  drawer: {
    shadowColor: '#000000',
    shadowOpacity: 0.8,
    shadowRadius: 3
  },

  holePicker: {
    flex: 1,
    padding: 20,
    height: 40,
    marginBottom: 5,
    backgroundColor: colors.actionText,
  },

  holePickerText: {
    textAlign: 'center',
    color: '#fff',
    fontFamily: 'Avenir',
  },

  addPlayerButton: {
    marginTop: 10,
    padding: 10,
    marginBottom: 10,
    backgroundColor: colors.actionText,
  },

  sectionHeader: {
    backgroundColor: '#eee',
    padding: 10,
  },

  sectionHeaderText: {
    color: '#777',
    fontSize: 12,
    fontFamily: 'Avenir',
  },
  courserow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: colors.cellBorder,
    flexDirection: 'row',
    padding: 20,
  }
});


