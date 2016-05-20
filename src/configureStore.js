import { AsyncStorage } from "react-native";
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import {persistStore, autoRehydrate} from 'redux-persist';
import Reactotron from 'reactotron';
import invariant from 'redux-immutable-state-invariant';

const middleware = __DEV__
                   ? [invariant(), Reactotron.reduxMiddleware, thunk]
                   : [thunk];

const createSgtStore = applyMiddleware(...middleware)(createStore);

const configureStore = (onComplete) => {
  const store = autoRehydrate()(createSgtStore)(reducers)
  persistStore(store, {storage: AsyncStorage}, onComplete);
  if(__DEV__) {
    Reactotron.addReduxStore(store)
  }
  return store;
}

export default configureStore;
