import React, {
  Component,
  Dimensions,
  View,
  StatusBar,
  Image
} from 'react-native';


export default class ScoreEvent extends Component {
  render() {
    return(
      <View style={{
        flexDirection: 'column',
        paddingTop: 250,
        backgroundColor: '#477dca',
        alignItems: 'center'
      }}>
        <StatusBar barStyle="light-content" />
      </View>
    )
  }
}
