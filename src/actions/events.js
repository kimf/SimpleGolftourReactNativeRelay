import { fetchEvents, saveEvent } from '../../lib/ApiService';


export function tryToSaveEvent(event, navigator) {
  return (dispatch, getState) => {
    dispatch(savingEvent());
    const state = getState();
    const sessionToken = state.auth.user.session_token;

    return saveEvent(event, sessionToken).then((event) => {
      dispatch(savedEvent(event));
      requestAnimationFrame(() => navigator.resetTo({ tab: 'events' }) );
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
    if(state.events.justAddedAnEvent) {
      return dispatch({type: 'CLEAR_JUST_ADDED_FLAG'});
    }
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
  const events = state.events.data.length;
  if (events === 0) {
    return true;
  }

  if (state.events.isFetching) {
    return false;
  }

  return true;
  // else if (latestEvent.updatedAt === 1 hour old) {}
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
