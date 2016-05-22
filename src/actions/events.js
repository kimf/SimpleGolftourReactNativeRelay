import { fetchEvents, saveEvent } from '../../lib/ApiService';


export function tryToSaveEvent(event, navigator) {
  return (dispatch, getState) => {
    dispatch(savingEvent());
    const state = getState();
    const sessionToken = state.auth.user.session_token;

    return saveEvent(event, sessionToken).then((event) => {
      dispatch(savedEvent(event));
      navigator.resetTo({ tab: 'events' });
    }).catch((error) => {
      console.log('Error saving event', error);
      dispatch(failedToSaveEvent(error));
    });
  }
}

function savedEvent(event) {
  return { type: 'SAVED_EVENT', event }
}

function failedToSaveEvent(error) {
  return { type: 'FAILED_TO_SAVE_EVENT', error }
}

function savingEvent() {
  return { type: 'SAVING_EVENT' }
}


/*
Fetching events
* ------------------------------------------------------------ */
export function fetchEventsIfNeeded() {
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

function shouldFetchEvents(state) {
  return true;
  const events = state.events.data.length;
  if (events === 0) {
    return true;
  } else if (state.events.isFetching) {
    return false;
  }
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

function requestEvents() {
  return { type: 'REQUEST_EVENTS' };
}

function receiveEvents(data) {
  return { type: 'RECEIVE_EVENTS', events: data.events };
}

function requestFailed(error) {
  return { type: 'REQUEST_FAILED', error }
}
