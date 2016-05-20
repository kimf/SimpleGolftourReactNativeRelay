'use strict';

import App from './App';
import React, { Component } from 'react';
import { Provider } from 'react-redux';

import configureStore from './configureStore';

export default class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      store: configureStore(() => this.setState({isLoading: false}))
    }
  }

  render() {
    if (this.state.isLoading) { return null; }
    return (
      <Provider store={this.state.store}>
        <App />
      </Provider>
    )
  }
}
