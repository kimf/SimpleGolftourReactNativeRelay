import { loginUser } from '../../lib/ApiService';

function tryLogin() {
  return { type: 'TRY_LOGIN' };
}

function loginSuccessful(user) {
 return { type: 'LOGIN_SUCCESS', user };
}

function loginFailed(email, error) {
  return { type: 'LOGIN_FAILED', email, error };
}

export function login(email, password) {
  return dispatch => {
    dispatch(tryLogin());

    return loginUser(email, password)
            .then((user) => {
              if(user.error) {
                dispatch(loginFailed(user.email, user.error));
              } else {
                dispatch(loginSuccessful(user));
              }
            })
            .catch((error) => {
              console.log('Error logging in', error);
              dispatch(loginFailed(email, error));
            })
  };
}
