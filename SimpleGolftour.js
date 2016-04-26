'use strict';

import NetworkLayer from './lib/NetworkLayer';
import { apiUrl } from './lib/AuthService';

import CurrentUser from './components/CurrentUser';
import CurrentUserRoute from './routes/CurrentUserRoute';
import Login from './components/Login';
import Loading from './components/Loading';

import React, {
  AsyncStorage,
  Component,
  Text,
  View,
} from 'react-native';

import Relay, {
  RootContainer,
} from 'react-relay';


export default class SimpleGolftour extends Component {
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
        this.setNetworkLayer(userData.session_token);
        this.setState({ component: 'CurrentUser', userData: userData});
      } else {
        this.setState({ component: 'Login', userData: userData});
      }
    });
  }

  render() {
    const { component, userData } = this.state;
    if(component === 'CurrentUser') {
      return (
        <RootContainer
          Component={CurrentUser}
          route={new CurrentUserRoute()}
          renderLoading={() => <Loading /> }
          renderFetched={(data) => {
            return (
              <CurrentUser onLogout={this.onLogout} currentUser={data.currentUser} />
            );
          }}
        />
      );
    } else if(component === 'Login') {
      return <Login onLogin={this.onLogin} userData={userData} />;
    } else {
      return null;
    }
  }

  setNetworkLayer(token) {
    const url = apiUrl + '/queries';
    Relay.injectNetworkLayer(
      new NetworkLayer(url, {
        headers: {
          Authorization: `Token ${token}`
        }
      })
    )
  }
}
