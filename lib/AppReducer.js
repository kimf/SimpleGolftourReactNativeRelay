import realm from '../realm';

export default function AppReducer(lastState, action) {
  let state = lastState;

  console.log(lastState);
  console.log(action);

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
      const holesCount = event.course.holes_count;

      for (let player of event.eventPlayers) {
        for (let hole of event.course.holes) {
          let extraStrokes = 0;
          if(hole.index <= player.strokes) {
            extraStrokes = 1;
            if(player.strokes > holesCount) {
              if(hole.index <= (player.strokes - holesCount)){
                extraStrokes = 2;
              }
            }
          }

          player.eventScores.push({
            beers: 0,
            extraStrokes: extraStrokes,
            hole: hole.number,
            index: hole.index,
            isScored: false,
            par: hole.par,
            points: 0,
            putts: 2,
            strokes: hole.par,
          });
        }
      }

      event.isScoring = true;
      event.currentHole = 1;
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

  if (action.type === 'showScorecard') {
    state = {
      scenes: [
        ...state.scenes,
        {
          type: 'showScorecard',
          key: 'showScorecard',
          event: action.event
        }
      ],
    };
  }

  if (action.type === 'setupEventPlayer') {
    let event = state.scenes[state.scenes.length-1].event || null;
    if(event === null) {
      event = state.scenes[state.scenes.length-2].event
    }
    state = {
      scenes: [
        ...state.scenes,
        {
          type: 'setupEventPlayer',
          key: 'setupEventPlayer',
          event: event,
          player: action.player,
          needsSaving: action.needsSaving
        }
      ],
    };
  }


  if (action.type === 'eventPlayerWasSetup') {
    const scenes = state.scenes.slice(0, 3);
    const event = scenes[2].event;

    state = {
      scenes: [
        ...scenes
      ],
    };
  }

  if (action.type === 'choosePlayer') {
    state = {
      scenes: [
        ...state.scenes,
        {
          type: 'choosePlayer',
          key: 'choosePlayer'
        }
      ],
    };
  }

  console.log(state);
  return state;
}
