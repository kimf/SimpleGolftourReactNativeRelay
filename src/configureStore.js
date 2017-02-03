import { AsyncStorage } from "react-native";
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import {persistStore, autoRehydrate} from 'redux-persist';
import invariant from 'redux-immutable-state-invariant';

const middleware = __DEV__
                   ? [invariant(), thunk]
                   : [thunk];

const createSgtStore = applyMiddleware(...middleware)(createStore);

const configureStore = (onComplete) => {
  const store = autoRehydrate()(createSgtStore)(reducers)
  persistStore(store, {storage: AsyncStorage}, onComplete);
  return store;
}

export default configureStore;
