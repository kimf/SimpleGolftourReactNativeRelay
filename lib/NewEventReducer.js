import realm from '../realm';

export default function EventsReducer(lastState, action) {
  let state = lastState;

  console.log(lastState);
  console.log(action);

  if (!state) {
    state = {
      scenes: [
        {
          type:'newEvent',
          key: 'newEvent'
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

  console.log(state);
  return state;
}
