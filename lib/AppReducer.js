import realm from '../realm';

export default function AppReducer(lastState, action) {
  let state = lastState;

  console.log('-- APP REDUCER ---');
  console.log(lastState);
  console.log(action);

  if (!state) {
    state = {
      scenes: [
        {
          key: 'leaderboard'
        }
      ],
    };
    console.log('... RETURN DEFAULT APP STATE');
    console.log(state);
    console.log('-- END APP REDUCER ---');
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

  if (action.type === 'setupEvent') {
    state = {
      scenes: [
        ...state.scenes,
        {
          type: 'setupEvent',
          key: 'setupEvent',
          event: action.event
        }
      ],
    };
  }

  console.log(state);
  console.log('-- END APP REDUCER ---');
  return state;
}
