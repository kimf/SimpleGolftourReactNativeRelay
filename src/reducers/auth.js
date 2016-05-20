import {REHYDRATE} from 'redux-persist/constants';

const initialState = {
  user: false,
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
      return {
        loggingIn: false,
        user: action.user
      }

    case "LOGIN_FAILED":
      return {
        loggingIn: false,
        user: { email: action.email, error: action.error }
      }

    default:
      return state;
  }
}
