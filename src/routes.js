import React, { Component, PropTypes } from 'react';
import { Actions, Router, Reducer, Scene, Switch } from 'react-native-router-flux';
import { connect } from 'react-redux';


import Master from './containers/Master';
import Login from './components/Login';

const selector = (props) => {
  return props.user && props.user.session_token ? "master" : "login"
}


const scenes = Actions.create(
  <Scene
    key="root"
    component={connect(state=>({user: state.auth.user}))(Switch)}
    selector={selector}
    tabs>
    <Scene key="login" component={connect(state=>({dispatch: state.dispatch, auth: state.auth}))(Login)} hideNavBar />
    <Scene key="master" component={Master} title="Tisdagsgolfen" initial/>

  </Scene>
);

class Routes extends Component {
  constructor(props) {
    super(props);
    this.reducerCreate = this.reducerCreate.bind(this);
  }

  static propTypes = {
    dispatch: PropTypes.func,
  }

  reducerCreate(params) {
    const defaultReducer = Reducer(params);
    return (state, action) => {
      this.props.dispatch(action)
      return defaultReducer(state, action);
    };
  }

  render () {
    return (
      <Router
        createReducer={this.reducerCreate}
        scenes={scenes} />
    );
  }
}

export default connect()(Routes);
