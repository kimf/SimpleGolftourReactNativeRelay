const initialState = { players: [] };

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case "FETCHING_SCORECARD":
      return state;

    case "RECEIVED_SCORECARD":
      console.log(action);
      return { players: action.players }

    case "CANCELED_SCORING":
      return initialState;

    case "LOGGED_OUT":
      return initialState;

    default:
      return state;
  }
}
