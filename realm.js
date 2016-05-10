'use strict';

import Realm from 'realm';
import sumBy from 'lodash.sumby';


class Hole {}
Hole.schema = {
  name: 'Hole',
  primaryKey: 'id',
  properties: {
    id: 'int',
    number: { type: 'int', indexed: true },
    index: 'int',
    par: 'int'
  }
};

class Course {}
Course.schema = {
  name: 'Course',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    holes_count: 'int',
    par: 'int',
    holes: { type: 'list', objectType: 'Hole' }
  }
};

class Club {}
Club.schema = {
  name: 'Club',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: { type: 'string', indexed: true },
    courses: { type: 'list', objectType: 'Course' }
  }
};

class EventScore {}
EventScore.schema = {
  name: 'EventScore',
  properties: {
    index: 'int',
    hole: { type: 'int', indexed: true },
    par: 'int',
    strokes: 'int',
    putts: 'int',
    beers: 'int',
    extraStrokes: 'int',
    points: 'int',
    isScored: { type: 'bool', default: false }
  }
}



class EventPlayer {
  get totalPoints() {
    return sumBy(this.eventScores, (s) => { return s.isScored ? s.points : 0; });
  }

  get totalPutts() {
    return sumBy(this.eventScores, (s) => { return s.isScored ? s.putts : 0; });
  }

  get totalStrokes() {
    return sumBy(this.eventScores, (s) => { return s.isScored ? s.strokes : 0; });
  }
}
EventPlayer.schema = {
  name: 'EventPlayer',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: { type: 'string', indexed: true },
    strokes: 'int',
    isScoring: { type: 'bool', default: false },
    eventScores: { type: 'list', objectType: 'EventScore' }
  }
}

class EventTeam {}
EventTeam.schema = {
  name: 'EventTeam',
  primaryKey: 'id',
  properties: {
    id: 'int',
    isScoring: { type: 'bool', default: false },
    eventPlayers: { type: 'list', objectType: 'EventPlayer' }
  }
}


class Event {}
Event.schema = {
  name: 'Event',
  primaryKey: 'id',
  properties: {
    id: 'int',
    startsAt: { type: 'date', indexed: true },
    status: { type: 'string', indexed: true },
    gametype: 'string',
    scoringType: 'string',
    teamEvent: 'bool',
    isScoring: { type: 'bool', default: false },
    currentHole: { type: 'int', default: 1 },
    course: { type: 'Course'},
    eventPlayers: { type: 'list', objectType: 'EventPlayer' },
    eventTeams: { type: 'list', objectType: 'EventTeam' }
  }
}

class Player {}
Player.schema = {
  name: 'Player',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    position: { type: 'int', indexed: true },
    eventCount: 'int',
    average: 'float',
    totalPoints: 'float',
    prevPos: 'int',
    points: 'string'
  }
}

// class CourseList {}
// CourseList.schema = {
//   name: 'CourseList',
//   properties: {
//     items: {type: 'list', objectType: 'Course', default: []},
//   },
// };

export default new Realm({
  schema: [Club, Course, Hole, Event, Player, EventPlayer, EventTeam, EventScore],
  schemaVersion: 12
});
