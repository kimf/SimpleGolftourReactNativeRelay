//import { saveScore } from '../../lib/ApiService';


// export function saveScore(event, navigator) {
//   return (dispatch, getState) => {
//     dispatch(savingEvent());
//     const sessionToken = getState().auth.user.session_token;
//     return startScoring(event.id, sessionToken).then((response) => {
//       dispatch(eventWasSaved(response));
//     })
//     .catch((error) => {
//       console.log('Could not save event', error);
//       dispatch(saveFailed(error));
//     })
//   }
// }
export function saveEventScore(playerId, holeNr, strokes, putts, points) {
  return { type: 'SAVED_EVENT_SCORE', playerId, holeNr, strokes, putts, points }
}


export function createEventScore(playerId, holeNr, data) {
  return { type: 'CREATED_EVENT_SCORE', playerId, holeNr, data }
}

export function changeHole(holeNr) {
 return { type: 'CHANGED_HOLE', holeNr }
}

export function setupEvent(event) {
  return (dispatch, getState) => {
    const player = getState().auth.user;
    dispatch(settingUpEvent(event, player));
  }
}

export function addPlayerToEvent(player, strokes) {
  return { type: 'ADDED_PLAYER_TO_EVENT', player, strokes }
}

export function changePlayerStrokes(player, strokes) {
  return { type: 'CHANGED_PLAYER_STROKES', player, strokes }
}

export function abortEventSetup() {
  return { type: 'ABORT_EVENT_SETUP' }
}

function settingUpEvent(event, player) {
  return { type: 'BEGIN_SCORING_SETUP', event, player }
}


// function savingEvent() {
//   return { type: 'SAVING_EVENT' }
// }

// function eventWasSaved(response) {
//   return { type: 'EVENT_WAS_SAVED', response: response }
// }

// function saveFailed(error) {
//   return { type: 'EVENT_SAVE_FAILED', error }
// }
