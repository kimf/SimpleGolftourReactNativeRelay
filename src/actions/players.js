import { fetchPlayers } from '../../lib/ApiService';

function requestPlayers() {
  return { type: 'REQUEST_PLAYERS' };
}

function receivePlayers(data) {
  return { type: 'RECEIVE_PLAYERS', data };
}

function requestFailed(error) {
  return { type: 'REQUEST_FAILED', error }
}


function goFetchPlayers(sessionToken) {
  return dispatch => {
    dispatch(requestPlayers());

    return fetchPlayers(sessionToken).then((data) => {
      dispatch(receivePlayers(data));
    })
    .catch((error) => {
      console.log('Error fetching players', error);
      dispatch(requestFailed(error));
    })
  };
}

function shouldFetchPlayers(state) {
  return true;
  const players = state.players.data.length;
  if (players === 0) {
    return true;
  } else if (state.players.isFetching) {
    return false;
  }
}


export function fetchPlayersIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    const state = getState();
    if (shouldFetchPlayers(state)) {
      // Dispatch a thunk from thunk!
      const sessionToken = state.auth.user.session_token;
      return dispatch(goFetchPlayers(sessionToken));
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve();
    }
  };
}
