const initialState = {
  isFetching: false,
  data: []
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case "REQUEST_PLAYERS":
      return {
        isFetching: true,
        data: state.data
      }

    case "RECEIVE_PLAYERS":
      return {
        isFetching: false,
        data: action.data
      }

    case "REQUEST_FAILED":
      return {
        isFetching: false,
        data: state.data,
        error: action.error
      }

    case "LOGGED_OUT":
      return initialState;

    default:
      return state;
  }
}
