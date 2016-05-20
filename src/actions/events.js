import { fetchEvents } from '../../lib/ApiService';

function requestEvents() {
  return { type: 'REQUEST_EVENTS' };
}

function receiveEvents(data) {
  return { type: 'RECEIVE_EVENTS', data };
}

function requestFailed(error) {
  return { type: 'REQUEST_FAILED', error }
}


function goFetchEvents(sessionToken) {
  return dispatch => {
    dispatch(requestEvents());

    return fetchEvents(sessionToken).then((data) => {
      dispatch(receiveEvents(data));
    })
    .catch((error) => {
      console.log('Error fetching events', error);
      dispatch(requestFailed(error));
    })
  };
}

function shouldFetchEvents(state) {
  return true;
  const events = state.events.data.length;
  if (events === 0) {
    return true;
  } else if (state.events.isFetching) {
    return false;
  }
}


export function fetchEventsIfNeeded() {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    const state = getState();
    if (shouldFetchEvents(state)) {
      // Dispatch a thunk from thunk!
      const sessionToken = state.auth.user.session_token;
      return dispatch(goFetchEvents(sessionToken));
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve();
    }
  };
}
