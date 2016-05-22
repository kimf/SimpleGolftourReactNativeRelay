import moment from 'moment';

const initialState = {
  isFetching: false,
  skipFetch: false,
  data: [],
};

function sortEvents(events) {
  return events.sort((a, b) => moment(b.starts_at) - moment(a.starts_at)).slice();
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case "REQUEST_EVENTS":
      return {
        isFetching: true,
        skipFetch: false,
        data: state.data,
      }

    case "RECEIVE_EVENTS":
      console.log(action);
      return {
        isFetching: false,
        data: sortEvents(action.events)
      }

    case "REQUEST_FAILED":
      return {
        isFetching: false,
        data: state.data,
        error: action.error
      }

    case "SAVING_EVENT":
      return {
        isFetching: false,
        data: state.data,
        isSaving: true
      }

    case "FAILED_TO_SAVE_EVENT":
      return {
        isFetching: false,
        data: state.data,
        isSaving: false,
        error: action.error
      }

    case "SAVED_EVENT":
      const data = sortEvents( [ ...state.data, action.event ] )
      return {
        isFetching: false,
        skipFetch: true,
        data: data,
        isSaving: false,
      }

    case "LOGGED_OUT":
      return initialState;

    default:
      return state;
  }
}
