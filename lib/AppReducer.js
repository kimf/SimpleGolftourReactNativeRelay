import realm from '../realm';

export default function AppReducer(lastState, action) {
  let state = lastState;

  if (!state) {
    const scoringEvent = realm.objects('Event').find(event => event.isScoring)
    if(scoringEvent) {
      state = {
        scenes: [
          {
            type: 'scoreEvent',
            key: 'scoreEvent',
            event: scoringEvent,
          }
        ],
      };
    } else {
      state = {
        scenes: [
          {key: 'leaderboard'}
        ],
      };
    }
    return(state);
  }

  if (action.type === 'back' && state.scenes.length > 1) {
    state = {
      scenes: state.scenes.slice(0, state.scenes.length - 1),
    };
  }

  if (action.type === 'openProfile') {
    state = {
      scenes: [
        ...state.scenes,
        {
          type: 'profile',
          key: 'profile'
        }
      ],
    };
  }

  if (action.type === 'openEvents') {
    state = {
      scenes: [
        ...state.scenes,
        {
          type: 'events',
          key: 'events'
        }
      ],
    };
  }

  if (action.type === 'newEvent') {
    state = {
      scenes: [
        ...state.scenes,
        {
          type: 'newEvent',
          key: 'newEvent'
        }
      ],
    };
  }

  if (action.type === 'selectPlayers') {
    state = {
      scenes: [
        ...state.scenes,
        {
          type: 'selectPlayers',
          key: 'selectPlayers',
          event: action.event
        }
      ],
    };
  }

  if (action.type === 'scoreEvent') {
    const event = action.event;

    realm.write(() => {
      const eventPlayers = [];
      for (let data of action.players) {
        const player = realm.objects('Player').filtered(`id == ${data.playerId}`)[0];

        const eventScores = [];
        for (let hole of event.course.holes) {
          eventScores.push({
            index: hole.index,
            hole: hole.number,
            strokes: hole.par,
            putts: 2,
            beers: 0,
            isScored: false
          });
        }

        eventPlayers.push({
          id: player.id,
          name: player.name,
          strokes: parseInt(data.strokes),
          isScoring: false,
          eventScores: eventScores
        });
      }

      event.isScoring = true;
      event.currentHole = 1;
      event.eventPlayers = eventPlayers;
    });

    state = {
      scenes: [
        {
          type: 'scoreEvent',
          key: 'scoreEvent',
          event: event,
        }
      ],
    };
  }

  if (action.type === 'cancelScoring') {
    const event = action.event;

    realm.write(() => {
      for (let player of event.eventPlayers) {
        for (let score of player.eventScores) {
          realm.delete(score);
        }
        realm.delete(player);
      }
      event.isScoring = false;
      event.currentHole = 0;
      event.eventPlayers = [];
    });

    state = {
      scenes: [
        {key: 'leaderboard'}
      ],
    };
  }

  if (action.type === 'eventWasCreated') {
    state = {
      scenes: [
        { key: 'leaderboard' },
        {
          type: 'events',
          key: 'events'
        }
      ],
    };
  }

  if (action.type === 'selectCourse') {
    state = {
      scenes: [
        ...state.scenes,
        {
          type: 'selectCourse',
          key: 'selectCourse'
        }
      ],
    };
  }

  if (action.type === 'setCourse') {
    const scenes = state.scenes.slice(0, state.scenes.length - 2)
    state = {
      scenes: [
        ...scenes,
       {
         type: 'newEvent',
         key: 'newEvent',
         course: action.course,
       }
      ],
    };
  }

  return state;
}
