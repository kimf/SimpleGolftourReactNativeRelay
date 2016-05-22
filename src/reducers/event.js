const initialState = { event: null, playing: [], isSaving: false };

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case "BEGIN_SCORING_SETUP":
      const currentPlayer = Object.assign({}, action.player, {strokes: 0});
      return { event: action.event, playing: [currentPlayer] }

    case "ADDED_PLAYER_TO_EVENT":
      const addedPlayer = Object.assign({}, action.player, { strokes: action.strokes});
      return { event: state.event, playing: [ ...state.playing, addedPlayer ] }

    case "CHANGED_PLAYER_STROKES":
      const playing = state.playing.map((player) => {
        if (player.id === action.player.id) {
          return Object.assign({}, player, { strokes: action.strokes})
        }
        return player
      })

      return {
        event: state.event,
        playing: playing
      }

    // case "SAVING_EVENT":
    //   return {
    //     event: state.event,
    //     playing: state.playing,
    //     isSaving: true
    //   }

    // case "EVENT_WAS_SAVED":
    //   //action.response
    //   return {
    //     event: state.event,
    //     playing: state.playing,
    //     isSaving: false
    //   }

    // case "EVENT_SAVE_FAILED":
    //   return {
    //     event: state.event,
    //     playing: state.playing,
    //     isSaving: false,
    //     error: action.error
    //   }

    case "LOGGED_OUT":
      return initialState;

    case "ABORT_EVENT_SETUP":
      return initialState;

    default:
      return state;
  }
}
