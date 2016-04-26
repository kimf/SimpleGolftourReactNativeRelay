import { DefaultNetworkLayer } from 'react-relay'
// import auth from './AuthService'
import React, { AsyncStorage } from 'react-native';

export default class NetworkLayer extends DefaultNetworkLayer {
   // Sends a POST request and DOES NOT retry if the request fails or times out.
   // Also redirects to login on 401
  _sendQuery(request) {
    return fetch(this._uri, {
      ...this._init,
      body: JSON.stringify({
        query: request.getQueryString(),
        variables: request.getVariables(),
      }),
      headers: {
        ...this._init.headers,
        'Accept': '*/*',
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })
    .then((response) => {
      if (response.status === 401) {
        AsyncStorage.removeItem('session_token');
        // window.location = '/login'
        throw 'Faulty token'
      } else {
        return response
      }
    })
  }
}

