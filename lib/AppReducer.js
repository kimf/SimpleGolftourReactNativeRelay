import { AsyncStorage } from 'react-native';

export default function AppReducer(lastState, action) {
  let state = lastState;

  if (!state) {
    state = {
      scenes: [
        {key: 'leaderboard'}
      ],
    };
  }

  if (action.type === 'rehydrate') {
    return state;
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
    state = {
      scenes: [
        {
          type: 'scoreEvent',
          key: 'scoreEvent',
          event: action.event,
          players: action.players
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

  AsyncStorage.setItem('currentNavState', JSON.stringify(state));

  return state;
}
