import { combineReducers } from 'redux';
import tabs from './tabs';
import auth from './auth';
import players from './players';
import events from './events';

export default combineReducers({
  auth,
  tabs,
  players,
  events
});
