import { pushScoreToServer, pushTeamScoreToServer, deleteScoresFromServer } from '../../lib/ApiService';

export function saveEventScore(eventId, item, eventScore, strokes, putts, points) {
  return (dispatch, getState) => {
    dispatch(pushingScore(item.id, eventScore.hole, strokes, putts, points));

    const sessionToken = getState().auth.user.session_token;

    if(getState().event.event.team_event) {
      const playerIds = item.players.map(p => {return p.id});
      return pushTeamScoreToServer(eventId, item.id, playerIds, eventScore, strokes, putts, points, sessionToken).then((response) => {
        dispatch(scoreWasSaved(item.id, eventScore.hole, response));
      })
      .catch((error) => {
        console.log('Error saving score', error);
        dispatch(failedToSaveScore(item.id, eventScore.hole, error));
      })
    } else {
      return pushScoreToServer(eventId, item.id, eventScore, strokes, putts, points, sessionToken).then((response) => {
        dispatch(scoreWasSaved(item.id, eventScore.hole, response));
      })
      .catch((error) => {
        console.log('Error saving score', error);
        dispatch(failedToSaveScore(item.id, eventScore.hole, error));
      })
    }
  };
}

export function cancelScoring() {
  return (dispatch, getState) => {
    const state = getState();
    const eventId = state.event.event.id;
    const sessionToken = state.auth.user.session_token;
    const scoreIds = [];
    const players = state.event.playing.map((player) => {
      const eventScores = player.eventScores.map((es) => {
        scoreIds.push(es.externalId);
      });
    });
    deleteScoresFromServer(eventId, scoreIds, sessionToken).then((response) => {
      dispatch({ type: 'CANCELED_SCORING', eventId })
    })
    .catch((error) => {
      console.log('Error deleting scores... bummer', error)
      dispatch({ type: 'CANCELED_SCORING', eventId })
    })
  }
}

export function saveScoring() {
  return { type: 'FINISHED_SCORING' }
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

function pushingScore(playerId, holeNr, strokes, putts, points) {
  return { type: 'PUSHING_SCORE', playerId, holeNr, strokes, putts, points }
}

function scoreWasSaved(playerId, holeNr, response) {
  return { type: 'SCORE_WAS_SAVED', playerId, holeNr, response }
}

function failedToSaveScore(playerId, holeNr, error) {
  return { type: 'FAILED_TO_SAVE_SCORE', playerId, holeNr, error }
}

export function addEventTeam(event) {
  return { type: 'ADDED_EVENT_TEAM', event }
}

export function addEventPlayer(player, teamIndex, event) {
  return { type: 'ADDED_PLAYER_TO_TEAM', player, teamIndex, event }
}

export function changeTeamStrokes(teamIndex, strokes) {
  return { type: 'CHANGED_TEAM_STROKES', teamIndex, strokes }
}
