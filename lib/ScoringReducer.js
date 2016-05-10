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


  if (action.type === 'showScorecard') {
    state = {
      scenes: [
        ...state.scenes,
        {
          type: 'showScorecard',
          key: 'showScorecard'
        }
      ],
    };
  }

  if (action.type === 'closeScorecard') {
    const scenes = state.scenes.slice(0, 1)
    state = {
      scenes: scenes
    };
  }

  console.log(state);
  console.log('-- END SCORING REDUCER ---');
  return state;
}
