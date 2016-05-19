const apiUrl = __DEV__
               ? 'http://simplegolftour.local:8123/api'
               : 'https://www.simplegolftour.com/api';

import realm from './AppRealm';
import moment from 'moment';

const exports = module.exports = {
  apiUrl: apiUrl,

  pushScoreToServer: (eventId, playerId, eventScore, sessionToken) => {
    let method = 'POST';
    let url = `${apiUrl}/events/${eventId}/live_scores`;

    if(eventScore.externalId !== null) {
      method = 'PUT';
      url = `${url}/${eventScore.externalId}`
    }

    const score = {
      data: {
        index: eventScore.index,
        hole: eventScore.hole,
        par: eventScore.par,
        extraStrokes: eventScore.extraStrokes,
        strokes: eventScore.strokes,
        putts: eventScore.putts,
        points: eventScore.points,
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
    }).then((score) => {
      realm.write(() => {
        eventScore.externalId = score.id;
      });
    });
  },

  deleteScoresFromServer: (eventId, scoreIds, sessionToken) => {
    console.log(scoreIds);
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

  saveEvent: (data, sessionToken) => {
    return fetch(`${apiUrl}/events`, {
      method: 'POST',
      crossOrigin: true,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Token token=${sessionToken}`
      },
      body: JSON.stringify({
        course: data.course.name,
        club: data.course.club,
        course_id: data.course.id,
        team_event: data.teamEvent,
        starts_at: data.date,
        scoring_type: data.isStrokes ? 'strokes' : 'points'
      })
    })
    .then((response) => {
      return response.json()
    })
    .then((event) => {
      realm.write(() => {
        realm.create('Event', {
          id: event.id,
          startsAt: moment(event.starts_at).toDate(),
          status: event.status,
          scoringType: event.scoring_type,
          teamEvent: event.team_event,
          course: data.course
        });
      });
    });
  },

  fetchPlayers: (sessionToken) => {
    const players = realm.objects('Player').sorted('position');
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
    })
    .then((json) => {
      json.map((player) => {
        realm.write(() => {
          realm.create('Player', {
            id: player.id,
            name: player.name,
            position: player.position,
            eventCount: player.num_events,
            average: player.average,
            totalPoints: parseFloat(player.total_points),
            prevPos: player.prev_position,
            points: player.points_array.toString()
          }, true);
        });
      });
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
    .then((json) => {
      json.events.map((event) => {
        const course = realm.objects('Course').filtered(`id == ${event.course_id}`)[0];
        realm.write(() => {
          realm.create('Event', {
            id: event.id,
            startsAt: moment(event.starts_at).toDate(),
            status: event.status,
            gametype: event.gametype,
            scoringType: event.scoring_type,
            teamEvent: event.team_event,
            course: course
          }, true);
        });
      });
    })
  },

  fetchClubs: () => {
    return fetch('http://golfstats.fransman.se/tisdagsgolfendata', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }
    })
    .then((response) => {
      return response.json()
    })
    .then((json) => {
      json.clubs.map((club) => {
        realm.write(() => {
          const courses = [];
          club.courses.map((course) => {
            const holes = [];
            course.holes.map((hole) => {
              holes.push({
                id: hole.id,
                number: hole.number,
                index: hole.index,
                par: hole.par
              });
            });

            courses.push({
              id: course.id,
              name: course.name,
              club: club.name,
              holes_count: course.holes_count,
              par: course.par,
              holes: holes
            });
          })

          realm.create('Club', {
            id: club.id,
            name: club.name,
            courses: courses
          }, true);
        });
      });
    })
  }
};



