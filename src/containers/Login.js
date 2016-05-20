import React, {Component, PropTypes} from "react";
import {Linking, StyleSheet, Text, TextInput, TouchableOpacity, View, Image} from "react-native";
import { login } from '../actions';
import { connect } from 'react-redux';

class Login extends Component {
  constructor(props){
    super(props);
    const email = props.auth.user ? props.auth.user.email : '';
    this.state = {
      email: email,
      password: '',
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.openPassword = this.openPassword.bind(this);
  }

  onSubmit(){
    const { dispatch } = this.props;
    const { email, password } = this.state;
    dispatch(login(email, password));
  }

  openPassword() {
    Linking.openURL('https://www.simplegolftour.com/password_resets/new');
  }


  render() {
    const { auth, dispatch } = this.props;

    let showError;
    if(auth.user.error) {
      showError = <Text style={{color: '#c00', fontSize: 20}}>Något gick fel, se över infon</Text>;
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
          <Text style={styles.btnLabel}>
            {auth.loggingIn ? 'JOBBAR' : 'LOGGA IN'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={this.openPassword}>
          <Text style={styles.forgotten}> Glömt dina uppgifter? </Text>
        </TouchableOpacity>
      </View>
    )
  }
}


Login.propTypes = {
  auth: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired
}


const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

export default connect(
  mapStateToProps
)(Login)


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
