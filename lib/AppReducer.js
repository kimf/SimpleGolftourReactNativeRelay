import { AsyncStorage } from 'react-native';
import realm from '../realm';

export default function AppReducer(lastState, action) {
  let state = lastState;

  if (!state) {
    state = {
      scenes: [
        {key: 'leaderboard'}
      ],
    };
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
    console.log(action.event);
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
      const eventPlayers = []
      for (let data of action.players) {
        const player = realm.objects('Player').filtered(`id == ${data.playerId}`)[0];

        eventPlayers.push({
          id: player.id,
          name: player.name,
          strokes: parseInt(data.strokes),
          isScoring: false,
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
