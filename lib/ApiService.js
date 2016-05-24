const apiUrl = __DEV__
               ? 'http://simplegolftour.local:8123/api'
               : 'https://www.simplegolftour.com/api';

import moment from 'moment';

const exports = module.exports = {
  apiUrl: apiUrl,

  pushScoreToServer: (eventId, playerId, eventScore, strokes, putts, points, sessionToken) => {
    let method = 'POST';
    let url = `${apiUrl}/events/${eventId}/live_scores`;

    if(eventScore.externalId) {
      method = 'PUT';
      url = `${url}/${eventScore.externalId}`
    }

    const score = {
      data: {
        index: eventScore.index,
        hole: eventScore.hole,
        par: eventScore.par,
        extraStrokes: eventScore.extraStrokes,
        strokes: strokes,
        putts: putts,
        points: points,
      },
      user_id: playerId
    }

    return fetch(url, {
      method: method,
      crossOrigin: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${sessionToken}`
      },
      body: JSON.stringify({live_score: score})
    })
    .then((response) => {
      return response.json()
    });
  },

  pushTeamScoreToServer: (eventId, teamIndex, playerIds, eventScore, strokes, putts, points, sessionToken) => {
    let method = 'POST';
    let url = `${apiUrl}/events/${eventId}/live_scores`;

    if(eventScore.externalId) {
      method = 'PUT';
      url = `${url}/${eventScore.externalId}`
    }

    const score = {
      data: {
        index: eventScore.index,
        hole: eventScore.hole,
        par: eventScore.par,
        extraStrokes: eventScore.extraStrokes,
        strokes: strokes,
        putts: putts,
        points: points,
        player_ids: playerIds,
      },
      team_index: teamIndex
    }

    return fetch(url, {
      method: method,
      crossOrigin: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${sessionToken}`
      },
      body: JSON.stringify({live_score: score})
    })
    .then((response) => {
      return response.json()
    });
  },

  deleteScoresFromServer: (eventId, scoreIds, sessionToken) => {
    return fetch(`${apiUrl}/events/${eventId}/live_scores/cancel`, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${sessionToken}`
      },
      body: JSON.stringify({live_score_ids: scoreIds})
    })
    .then((response) => {
      return response.json()
    });
  },

  fetchEventLeaderboard: (eventId, sessionToken) => {
    return fetch(`${apiUrl}/events/${eventId}/leaderboard`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${sessionToken}`
      }
    })
    .then((response) => {
      return response.json()
    });
  },

  saveEvent: (event, sessionToken) => {
    return fetch(`${apiUrl}/events`, {
      method: 'POST',
      crossOrigin: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${sessionToken}`
      },
      body: JSON.stringify({
        course: event.courseName,
        club: event.clubName,
        course_id: event.courseId,
        team_event: event.teamEvent,
        starts_at: event.date,
        scoring_type: event.scoringType
      })
    })
    .then((response) => {
      return response.json()
    });
  },

  fetchPlayers: (sessionToken) => {
    return fetch(`${apiUrl}/leaderboard`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${sessionToken}`
      }
    })
    .then((response) => {
      return response.json()
    });
  },

  fetchEvents: (sessionToken) => {
    return fetch(`${apiUrl}/events`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${sessionToken}`
      }
    })
    .then((response) => {
      return response.json()
    })
  },

  // fetchClubs: () => {
  //   return fetch('http://golfstats.fransman.se/tisdagsgolfendata', {
  //     method: 'GET',
  //     headers: {
  //       Accept: 'application/json',
  //       'Content-Type': 'application/json',
  //     }
  //   })
  //   .then((response) => {
  //     return response.json()
  //   })
  // },

  loginUser: (email, password) => {
    return fetch(`${apiUrl}/sessions`, {
      method: 'POST',
      crossOrigin: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email, password
      })
    })
    .then((response) => {
      return response.json()
    });
  }
};



