import realm from '../realm';

export default function ScoringReducer(lastState, action) {
  let state = lastState;

  console.log('-- SCORING REDUCER ---');
  console.log(lastState);
  console.log(action);

  if (!state) {
    state = {
      scenes: [
        {
          key: 'firstRun'
        }
      ],
    };
    return(state);
  }

  if (action.type === 'back' && state.scenes.length > 1) {
    state = {
      scenes: state.scenes.slice(0, state.scenes.length - 1),
    };
  }

  if (action.type === 'scoreEvent') {
    const event = action.event;
    realm.write(() => {
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


  if (action.type === 'selectPlayers') {
    state = {
      scenes: [
        ...state.scenes,
        {
          type: 'selectPlayers',
          key: 'selectPlayers'
        }
      ],
    };
  }

  if (action.type === 'setupEventPlayer') {
    state = {
      scenes: [
        ...state.scenes,
        {
          type: 'setupEventPlayer',
          key: 'setupEventPlayer',
          player: action.player,
          needsSaving: action.needsSaving
        }
      ],
    };
  }


  if (action.type === 'eventPlayerWasSetup') {
    const scenes = state.scenes.slice(0, 1);

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
  console.log('-- END SCORING REDUCER ---');
  return state;
}
