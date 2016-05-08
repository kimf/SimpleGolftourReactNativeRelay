'use strict';

import Realm from 'realm';
import moment from 'moment';

class Hole {}
Hole.schema = {
  name: 'Hole',
  primaryKey: 'id',
  properties: {
    id: 'int',
    number: 'int',
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
    holes: { type: 'list', objectType: 'Hole' },
  }
};

class Club {}
Club.schema = {
  name: 'Club',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    courses: { type: 'list', objectType: 'Course' },
  }
};

class EventScore {}
EventScore.schema = {
  name: 'EventScore',
  properties: {
    hole: 'int',
    strokes: 'int',
    putts: 'int',
    beers: 'int'
  }
}

class EventPlayer {}
EventPlayer.schema = {
  name: 'EventPlayer',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    strokes: 'int',
    isScoring: 'bool',
    eventScores: { type: 'list', objectType: 'EventScore' }
  }
}


class Event {}
Event.schema = {
  name: 'Event',
  primaryKey: 'id',
  properties: {
    id: 'int',
    startsAt: 'date',
    status: 'string',
    gametype: 'string',
    scoringType: 'string',
    teamEvent: 'bool',
    isScoring: 'bool',
    currentHole: 'int',
    course: { type: 'Course'},
    eventPlayers: { type: 'list', objectType: 'EventPlayer' }
  }
}

class Player {}
Player.schema = {
  name: 'Player',
  primaryKey: 'id',
  properties: {
    id: 'int',
    name: 'string',
    position: 'int',
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
  schema: [Club, Course, Hole, Event, Player, EventPlayer, EventScore],
  schemaVersion: 6
});
