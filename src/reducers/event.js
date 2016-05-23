const initialState = { event: null, playing: [], currentHole: 1 };

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case "BEGIN_SCORING_SETUP":
      const currentPlayer = Object.assign({}, {
        id: action.player.id,
        name: action.player.name,
        strokes: 0,
        eventScores: []
      });
      return { event: action.event, playing: [currentPlayer] }

    case "ADDED_PLAYER_TO_EVENT":
      const addedPlayer = Object.assign({}, {
        id: action.player.id,
        name: action.player.name,
        strokes: action.strokes,
        eventScores: []
      });
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

    case "PUSHING_SCORE":
      const pushingPlayers = state.playing.map((player) => {
        if (player.id === action.playerId) {
          const eventScores = player.eventScores.map((es) => {
            if (es.hole === action.holeNr) {
              return Object.assign(
                {},
                es,
                {
                  isBeingSaved: true,
                  isScored: false,
                  strokes: action.strokes,
                  putts: action.putts,
                  points: action.points
                }
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
        playing: pushingPlayers,
        currentHole: state.currentHole,
      }

    case "SCORE_WAS_SAVED":
      // add externalId from response.id!!!!
      const savingPlayers = state.playing.map((player) => {
        if (player.id === action.playerId) {
          const eventScores = player.eventScores.map((es) => {
            if (es.hole === action.holeNr) {
              return Object.assign(
                {},
                es,
                {
                  isBeingSaved: false,
                  isScored: true,
                  externalId: action.response.id
                }
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

    case "FAILED_TO_SAVE_SCORE":
      const erroredPlayers = state.playing.map((player) => {
        if (player.id === action.playerId) {
          const eventScores = player.eventScores.map((es) => {
            if (es.hole === action.holeNr) {
              return Object.assign(
                {},
                es,
                {
                  isBeingSaved: false,
                  isScored: false,
                  hasError: true,
                  error: action.error
                }
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
        playing: erroredPlayers,
        currentHole: state.currentHole
      }

    case "LOGGED_OUT":
      return initialState;

    case "CANCELED_SCORING":
      return initialState;

    case "ABORT_EVENT_SETUP":
      return initialState;

    default:
      return state;
  }
}
