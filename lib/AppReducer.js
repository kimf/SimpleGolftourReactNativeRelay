export default function AppReducer(lastState, action) {
  let state = lastState;
  console.log(this)
  if (!state) {
    state = {
      scenes: [
        {key: 'leaderboard'}
      ],
    };
  }
  if (action.type === 'back' && state.scenes.length > 1) {
    return {
      scenes: state.scenes.slice(0, state.scenes.length - 1),
    };
  }
  if (action.type === 'openProfile') {
    return {
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
    return {
      scenes: [
        ...state.scenes,
        {
          type: 'events',
          key: 'events'
        }
      ],
    };
  }

  return state;
}
