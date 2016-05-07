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
    course: { type: 'Course'},
    players: { type: 'list', type: 'Player' }
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
  schema: [Club, Course, Hole, Event, Player],
  schemaVersion: 5
});
