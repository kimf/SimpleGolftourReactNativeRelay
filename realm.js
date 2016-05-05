'use strict';

import Realm from 'realm';

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

// class CourseList {}
// CourseList.schema = {
//   name: 'CourseList',
//   properties: {
//     items: {type: 'list', objectType: 'Course', default: []},
//   },
// };

export default new Realm({schema: [Club, Course, Hole], schemaVersion: 1});
