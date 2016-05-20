import { combineReducers } from 'redux';
import routes from './routes';
import auth from './auth';
// ... other reducers

export default combineReducers({
  routes,
  auth
  // ... other reducers
});
