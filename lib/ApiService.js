const apiUrl = __DEV__
               ? 'http://simplegolftour.local:8123/api'
               : 'http://home.fransman.se:8123/api';

import realm from '../realm';
import moment from 'moment';

const exports = module.exports = {
  apiUrl: apiUrl,

  fetchPlayers: (sessionToken) => {
    const players = realm.objects('Player').sorted('position');
    return fetch(apiUrl + '/leaderboard', {
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
    return fetch(apiUrl + '/events', {
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



