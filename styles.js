'use strict';


module.exports = require('react-native').StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  header: {
    height: 60,
    backgroundColor: '#477dca'
  },
  inlineHeader: {
    paddingTop: 10,
    paddingBottom:10,
    backgroundColor: '#ccc'
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
  inlineBtn: {
    marginTop: 10,
    padding: 5,
    backgroundColor: '#000',
    color: '#fff',
    borderRadius: 4,
    textAlign: 'center',
  },
  smallInlineBtn: {
    padding: 2,
    backgroundColor: '#ccc',
    color: '#777',
    borderRadius: 4,
    textAlign: 'center',
  },
  todayBanner: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: 'green',
    padding: 5,
    textAlign: 'center',
    marginBottom: 5
  },
  segmentedcontrol: {
    margin: 10,
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
  },
  points: {
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
    color: '#777',
    flex: 1,
    fontSize: 12,
    marginTop: 3,
  },
  name: {
    fontWeight: 'bold',
    flex: 1,
    fontSize: 14,
  },
  row: {
    flex: 1
  },
  heading: {
    fontSize: 40,
    marginTop: 20,
  },
  label: {
    marginTop: 10,
    marginLeft: 10,
    color: '#444',
    fontSize: 16,
  },
  inputField: {
    padding: 5,
    margin: 10,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 4,
    fontSize: 16,
  },
  datepicker: {
    height: 50
  },
  radio: {
    padding: 10
  },
  selectedDate: {
    marginTop: 5,
    marginLeft: 10,
    color: '#222',
    fontSize: 14,
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderTopColor: '#ccc',
    borderTopWidth: 1
  },
  toggleDatePicker: {
    padding: 10,
    paddingLeft: 0,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  danger: {
    backgroundColor: 'red'
  },
  eventCard: {
    flexDirection: 'column',
  },
  scoring: {
    backgroundColor: '#feb'
  },
  playerRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start'
  },
  playerName: {
    flex: 4,
  },
  playerHoleData: {
    flex: 1,
    fontSize: 16
  },
  scorebox: {
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 20,
    paddingTop: 20
  },
  scoreRow: {
    borderBottomWidth: 0.5,
    borderColor: '#cecece',
    flexDirection: 'column',
    paddingRight: 10,
    paddingLeft: 10,
    paddingBottom: 20,
    paddingTop: 20
  },
  picker: {
    flex: 1
  },
  needsScore: {
    color: '#eee'
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
    borderWidth: 1,
    borderRadius: 2,
    fontSize: 14,
    flex: 1,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 10,
  },
  strokeInfo: {
    flex: 1,
    textAlign: 'right'
  },
  smallLabel: {
    fontSize: 10
  }
});
