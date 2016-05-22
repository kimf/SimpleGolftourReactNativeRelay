const initialState = { event: null, playing: [], isSaving: false, currentHole: 1 };


export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case "BEGIN_SCORING_SETUP":
      const currentPlayer = Object.assign({}, action.player, {strokes: 0, eventScores: []});
      return { event: action.event, playing: [currentPlayer] }

    case "ADDED_PLAYER_TO_EVENT":
      const addedPlayer = Object.assign({}, action.player, { strokes: action.strokes, eventScores: []});
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
        playing: playing,
      }

    case "CHANGED_HOLE":
      return {
        event: state.event,
        playing: state.playing,
        currentHole: action.holeNr
      }

    case "CREATED_EVENT_SCORE":
      //playerId, holeNr, data
      const playingPlayers = state.playing.map((player) => {
        if (player.id === action.playerId) {
          return Object.assign({}, player, { eventScores: [...player.eventScores, action.data] })
        }
        return player
      })

      return {
        event: state.event,
        playing: playingPlayers,
        currentHole: state.currentHole
      }

    case "SAVED_EVENT_SCORE":
      //playerId, holeNr, strokes, putts, points
      const savingPlayers = state.playing.map((player) => {
        if (player.id === action.playerId) {
          const eventScores = player.eventScores.map((es) => {
            if (es.hole === action.holeNr) {
              return Object.assign(
                {},
                es,
                { strokes: action.strokes, putts: action.putts, points: action.points, isScored: true  }
              )
            }
            return es;
          })
          return Object.assign({}, player, { eventScores })
        }
        return player
      })

      return {
        event: state.event,
        playing: savingPlayers,
        currentHole: state.currentHole
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
