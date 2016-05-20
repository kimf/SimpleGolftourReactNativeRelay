import {REHYDRATE} from 'redux-persist/constants';

const initialState = {
  loggingIn: false,
  user: {},
};

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case REHYDRATE:
      var incoming = action.payload.auth
      if (incoming) return incoming
      return state;

    case "TRY_LOGIN":
      return {
        loggingIn: true,
        user: { email: action.email, error: false },
      };

    case "LOGIN_SUCCESS":
      action.user.isLoggedIn = true;
      action.user.error = false;
      return {
        loggingIn: false,
        user: action.user
      }

    case "LOGIN_FAILED":
      return {
        loggingIn: false,
        user: { email: action.email, error: action.error }
      }

    case "LOGGED_OUT":
      return {
        loggingIn: false,
        user: { email: state.user.email }
      }

    default:
      return state;
  }
}
