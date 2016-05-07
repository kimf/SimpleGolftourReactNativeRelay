'use strict';
import React, {
  AsyncStorage,
  Component,
} from 'react-native';

import Default from './containers/Default';
import Login from './containers/Login';
import LoadingClubs from './components/LoadingClubs';

import realm from './realm';

export default class Wrapper extends Component {
  constructor(props){
    super(props);
    this.state = { component: null }
    this.onLogin = this.checkUserCreds.bind(this);
    this.clubsIsLoaded = this.checkUserCreds.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  componentWillMount() {
    // AsyncStorage.removeItem('currentNavState');
    // AsyncStorage.removeItem('userData');
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

        let clubs = realm.objects('Club');
        // let courses = realm.objects('Course');
        // let holes = realm.objects('Hole');
        // realm.write(() => {
        //   realm.delete(clubs);
        //   realm.delete(courses);
        //   realm.delete(holes);
        // })
        if(clubs.length === 0) {
          this.setState({component: 'LoadingClubs'});
        } else {
          AsyncStorage.getItem('currentNavState', (err, result) => {
            const currentNavState = JSON.parse(result);
            this.setState({
              component: 'Default',
              userData: userData,
              navState: currentNavState
            });
          });
        }
      } else {
        this.setState({ component: 'Login', userData: userData, navState: null });
      }
    });
  }

  render() {
    const { component, userData, navState } = this.state;

    if(component === 'LoadingClubs') {
      return (
        <LoadingClubs onDone={this.clubsIsLoaded} />
      );
    } else if(component === 'Default') {
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
