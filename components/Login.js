import React, {
  AsyncStorage,
  Component,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image
} from 'react-native';

import { apiUrl } from '../lib/AuthService';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class Login extends Component {
  constructor(props){
    super(props);
    const userData = props.userData;
    const email = userData ? userData.email : '';
    this.state = {
      loginError: false,
      email: email,
      password: ''
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(){
    const { email, password } = this.state;
    const url = apiUrl + '/sessions';

    fetch(url, {
      method: 'POST',
      crossOrigin: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email, password
      })
    })
    .then((response) => {
      if (response.status >= 400) {
        AsyncStorage.removeItem('userData')
      }
      return response.json()
    })
    .then((user) => {
      if(user.error){
        this.setState({ loginError: true });
      } else if (user.session_token && user.session_token !== '') {
        user.isLoggedIn = true;
        user.email = email;
        AsyncStorage.setItem('userData', JSON.stringify(user));
        this.props.onLogin();
      }
    }).catch((error) => {
      alert('Kunde inte logga in, Var god se över informationen');
      console.log('Error retreiving data', error);
      this.setState({ loginError: true });
    })
  }


  render() {
    const { email, password, loginError } = this.state;
    let showError;
    if(loginError) {
      showError = <Text style={{color: '#c00'}}>Något gick fel, se över infon</Text>;
    }

    return(
      <View style={{
        flexDirection: 'column',
        paddingTop: 40,
        backgroundColor: '#477dca',
        alignItems: 'center',
        width: width,
        height: height
      }}>
        <StatusBar barStyle="light-content" />
        <Image source={require('../images/logo.png')} />

        {showError}


        <Text style={styles.label}>E-post</Text>
        <TextInput
          style={styles.inputField}
          autoCapitalize="none"
          ref= "email"
          onChangeText={(email) => this.setState({email})}
          value={this.state.email}
        />

        <Text style={styles.label}>Lösenord</Text>
        <TextInput
          style={styles.inputField}
          autoCapitalize="none"
          secureTextEntry={true}
          ref= "password"
          onChangeText={(password) => this.setState({password})}
          value={this.state.password}
        />

        <TouchableOpacity style={styles.btn} onPress={this.onSubmit}>
          <Text style={styles.btnLabel}> LOGGA IN </Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={styles.forgotten}> Glömt dina uppgifter? </Text>
        </TouchableOpacity>
      </View>
    )
  }
}


let styles = StyleSheet.create({
  label: {
    marginTop: 10,
    color: 'white',
    fontSize: 20,
  },
  inputField: {
    paddingLeft: 5,
    margin: 10,
    height: 40,
    width: 300,
    backgroundColor: 'white',
    borderRadius: 5,
  },
  btn: {
    marginTop: 15,
    padding: 10,
    paddingLeft: 55,
    paddingRight: 55,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 25,
  },
  btnLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  forgotten: {
    marginTop: 40,
    color: 'white',
    fontSize: 14,
    textDecorationLine: 'underline'
  }
});
