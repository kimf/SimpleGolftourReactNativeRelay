import { combineReducers } from 'redux';
import tabs from './tabs';
import auth from './auth';
// ... other reducers

export default combineReducers({
  auth,
  tabs
  // ... other reducers
});
