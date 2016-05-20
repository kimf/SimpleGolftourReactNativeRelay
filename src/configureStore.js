import { AsyncStorage } from "react-native";
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';
import {persistStore, autoRehydrate} from 'redux-persist';
import Reactotron from 'reactotron';

const isDebuggingInChrome = __DEV__ && !!window.navigator.userAgent;

const middleware = [thunk, Reactotron.reduxMiddleware];
const createSgtStore = applyMiddleware(...middleware)(createStore);

const configureStore = (onComplete) => {
  const store = autoRehydrate()(createSgtStore)(reducers)
  persistStore(store, {storage: AsyncStorage}, onComplete);

  if(__DEV__) {
    Reactotron.addReduxStore(store)
  }
  if(isDebuggingInChrome) {
    window.store = store;
  }

  return store;
}

export default configureStore;
