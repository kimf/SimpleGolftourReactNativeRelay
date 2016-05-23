import { fetchEventLeaderboard } from '../../lib/ApiService';

export function refreshScorecard(eventId) {
  return (dispatch, getState) => {
    dispatch(fetchingScorecard());

    const sessionToken = getState().auth.user.session_token;
    return fetchEventLeaderboard(eventId, sessionToken).then((response) => {
      dispatch(receivedScorecard(response));
    })
    .catch((error) => {
      console.log('Error refreshing scorecard', error);
      return Promise.resolve();
    })
  }
}

function fetchingScorecard() {
  return { type: 'FETCHING_SCORECARD' }
}

function receivedScorecard(players) {
  return { type: 'RECEIVED_SCORECARD', players }
}
