// 'use strict';

// import Realm from 'realm';
// import sumBy from 'lodash.sumby';

// class CurrentUser {}
// CurrentUser.schema = {
//   name: 'CurrentUser',
//   primaryKey: 'id',
//   properties: {
//     id: 'int',
//     isLoggedIn: 'bool',
//     sessionToken: 'string',
//     email: 'string',
//     name: 'string'
//   }
// }


// class Hole {}
// Hole.schema = {
//   name: 'Hole',
//   primaryKey: 'id',
//   properties: {
//     id: 'int',
//     number: { type: 'int', indexed: true },
//     index: 'int',
//     par: 'int'
//   }
// };

// class Course {}
// Course.schema = {
//   name: 'Course',
//   primaryKey: 'id',
//   properties: {
//     id: 'int',
//     club: 'string',
//     name: 'string',
//     holes_count: 'int',
//     par: 'int',
//     holes: { type: 'list', objectType: 'Hole' },

//   }
// };

// class Club {}
// Club.schema = {
//   name: 'Club',
//   primaryKey: 'id',
//   properties: {
//     id: 'int',
//     name: { type: 'string', indexed: true },
//     courses: { type: 'list', objectType: 'Course' }
//   }
// };

// class EventScore {}
// EventScore.schema = {
//   name: 'EventScore',
//   properties: {
//     externalId: { type: 'int', optional: true },
//     index: 'int',
//     hole: { type: 'int', indexed: true },
//     par: 'int',
//     extraStrokes: 'int',
//     strokes: { type: 'int', optional: true },
//     putts: { type: 'int', optional: true },
//     points: { type: 'int', optional: true },
//     isScored: { type: 'bool', default: false }
//   }
// }



// class EventPlayer {
//   get totalPoints() {
//     return sumBy(this.eventScores, (s) => { return s.isScored ? s.points : 0; });
//   }

//   get totalPutts() {
//     return sumBy(this.eventScores, (s) => { return s.isScored ? s.putts : 0; });
//   }

//   get totalStrokes() {
//     return sumBy(this.eventScores, (s) => { return s.isScored ? s.strokes : 0; });
//   }

//   get playedHoles() {
//     return sumBy(this.eventScores, (s) => { return s.isScored });
//   }
// }
// EventPlayer.schema = {
//   name: 'EventPlayer',
//   primaryKey: 'id',
//   properties: {
//     id: 'int',
//     beers: { type: 'int', optional: true },
//     name: { type: 'string', indexed: true },
//     strokes: { type: 'int', default: 0 },
//     eventScores: { type: 'list', objectType: 'EventScore' }
//   }
// }

// class EventTeam {}
// EventTeam.schema = {
//   name: 'EventTeam',
//   primaryKey: 'id',
//   properties: {
//     id: 'int',
//     isScoring: { type: 'bool', default: false },
//     eventPlayers: { type: 'list', objectType: 'EventPlayer' }
//   }
// }


// class Event {}
// Event.schema = {
//   name: 'Event',
//   primaryKey: 'id',
//   properties: {
//     id: 'int',
//     startsAt: { type: 'date', indexed: true },
//     status: { type: 'string', indexed: true },
//     scoringType: 'string',
//     teamEvent: { type: 'bool', default:  false },
//     isScoring: { type: 'bool', default: false },
//     currentHole: { type: 'int', default: 1 },
//     course: { type: 'Course' },
//     eventPlayers: { type: 'list', objectType: 'EventPlayer', default: [] },
//     eventTeams: { type: 'list', objectType: 'EventTeam', default: [] }
//   }
// }

// class Player {}
// Player.schema = {
//   name: 'Player',
//   primaryKey: 'id',
//   properties: {
//     id: 'int',
//     name: 'string',
//     position: { type: 'int', indexed: true },
//     eventCount: 'int',
//     average: 'float',
//     totalPoints: 'float',
//     prevPos: 'int',
//     points: 'string'
//   }
// }

// export default new Realm({
//   schema: [Club, Course, Hole, Event, Player, EventPlayer, EventTeam, EventScore, CurrentUser],
//   schemaVersion: 18
// });
