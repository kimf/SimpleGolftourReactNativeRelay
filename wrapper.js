'use strict';
import React, {
  AsyncStorage,
  Component,
} from 'react-native';

import Default from './containers/Default';
import Login from './containers/Login';
import Loading from './components/Loading';

export default class Wrapper extends Component {
  constructor(props){
    super(props);
    this.state = { component: 'Loading' }
    this.onLogin = this.checkUserCreds.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  componentWillMount() {
    this.checkUserCreds();
  }

  onLogout() {
    AsyncStorage.removeItem('currentNavState');
    AsyncStorage.getItem('userData', (err, result) => {
      let userData = JSON.parse(result);
      AsyncStorage.setItem('userData', JSON.stringify({ email: userData.email }));
      this.setState({
        component: 'Login',
        onLogin: this.onLogin,
        userData: userData
      });
    });
  }

  checkUserCreds() {
    //AsyncStorage.removeItem('userData');
    AsyncStorage.getItem('userData', (err, result) => {
      let userData = JSON.parse(result);

      if(userData && userData.isLoggedIn && userData.session_token) {

        AsyncStorage.getItem('currentNavState', (err, result) => {
          const currentNavState = JSON.parse(result);
          this.setState({
            component: 'Default',
            userData: userData,
            navState: currentNavState
          });
        });
      } else {
        this.setState({ component: 'Login', userData: userData, navState: null });
      }
    });
  }

  render() {
    const { component, userData, navState } = this.state;
    if(component === 'Default') {
      return (
        <Default
          onLogout={this.onLogout}
          currentNavState={navState}
          currentUser={userData}
        />
      );
    } else if(component === 'Login') {
      return <Login onLogin={this.onLogin} userData={userData} />;
    } else {
      return null;
    }
  }
}
