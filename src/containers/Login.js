import React, {Component} from "react";
import {Linking, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Image} from "react-native";

import { apiUrl } from '../../lib/ApiService';
import realm from '../../lib/AppRealm';

export default class Login extends Component {
  constructor(props){
    super(props);
    const currentUser = props.currentUser;
    const email = currentUser ? currentUser.email : '';

    this.state = {
      loginError: false,
      email: email,
      password: ''
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.openPassword = this.openPassword.bind(this);
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
      return response.json()
    })
    .then((user) => {
      if(user.error){
        this.setState({ loginError: true });
      } else if (user.session_token && user.session_token !== '') {
        user.isLoggedIn = true;
        realm.write(() => {
          realm.create('CurrentUser', {
            id: user.id,
            email: user.email,
            name: user.name,
            sessionToken: user.session_token,
            isLoggedIn: true
          }, true);
        })
        this.props.onLogin();
      }
    }).catch((error) => {
      alert('Kunde inte logga in, Var god se över informationen');
      console.log('Error retreiving data', error);
      this.setState({ loginError: true });
    })
  }

  openPassword() {
    Linking.openURL('https://www.simplegolftour.com/password_resets/new');
  }


  render() {
    const { email, password, loginError } = this.state;
    let showError;
    if(loginError) {
      showError = <Text style={{color: '#c00'}}>Något gick fel, se över infon</Text>;
    }

    return(
      <View style={{
        flex: 1,
        flexDirection: 'column',
        paddingTop: 60,
        backgroundColor: '#477dca',
        alignItems: 'center'
      }}>
        <Image source={require('../images/logo.png')} />

        {showError}

        <Text style={styles.label}>E-post</Text>
        <TextInput
          style={styles.inputField}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
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

        <TouchableOpacity onPress={this.openPassword}>
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
    padding: 5,
    margin: 10,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    fontSize: 20,
    textAlign: 'center'
  },
  btn: {
    marginTop: 10,
    padding: 15,
    paddingLeft: 80,
    paddingRight: 80,
    borderRadius: 10,
    backgroundColor: 'black'
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
