import moment from 'moment';
import Immutable from 'seamless-immutable';
import clubsJson from '../../lib/clubs.json';

const initialState = Immutable({
  isFetching: false,
  data: [],
});

let coursesArray = {};
clubsJson.clubs.map(c => {
  let courses = {};
  if(c.courses.length === 0) { return false };
  clubName = c.name;
  c.courses.map((co) => {
    co.clubName = clubName;
    co.holes = co.holes.sort((a, b) => a.number - b.number)
    courses[co.name] = co;
    coursesArray[co.id] = co;
  });
})

function sortEvents(events) {
  const coursedEvents = events.map(e => {
    if(e.courseData !== undefined || e.course_id === null) {
      return e;
    }
    return Immutable(e).merge({courseData: coursesArray[e.course_id]});
  });
  return Immutable(coursedEvents.sort((a, b) => moment(b.starts_at) - moment(a.starts_at)));
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case "REQUEST_EVENTS":
      return Immutable({
        isFetching: true,
        data: state.data,
      })

    case "RECEIVE_EVENTS":
      return Immutable({
        isFetching: false,
        data: sortEvents(action.events)
      })

    case "REQUEST_FAILED":
      return Immutable({
        isFetching: false,
        data: state.data,
        error: action.error
      })

    case "SAVING_EVENT":
      return Immutable({
        isFetching: false,
        data: state.data,
        isSaving: true
      })

    case "FAILED_TO_SAVE_EVENT":
      return Immutable({
        isFetching: false,
        data: state.data,
        isSaving: false,
        error: action.error
      })

    case "SAVED_EVENT":
      const data = sortEvents( state.data.concat(action.event).asMutable() )
      return Immutable({
        isFetching: false,
        data: data,
        isSaving: false,
        justAddedAnEvent: true,
      })

    case "CLEAR_JUST_ADDED_FLAG":
      return Immutable({
        isFetching: false,
        data: state.data,
        isSaving: false,
        justAddedAnEvent: false
      })

    case "LOGGED_OUT":
      return initialState;

    default:
      return state;
  }
}
