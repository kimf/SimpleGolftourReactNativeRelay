import { ActionSheetIOS } from 'react-native';
import { loginUser } from '../../lib/ApiService';

export function changeTab(tab) {
  return { type: 'CHANGE_TAB', tab: tab }
}


function tryLogin() {
  return { type: 'TRY_LOGIN' };
}

function loginSuccessful(user) {
 return { type: 'LOGIN_SUCCESS', user };
}

function loginFailed(email, error) {
  return { type: 'LOGIN_FAILED', email, error };
}

function logOut() {
  return { type: 'LOGGED_OUT' }
}

export function logOutWithPrompt() {
  return (dispatch, getState) => {
    let name = getState().auth.user.name || 'there';
    ActionSheetIOS.showActionSheetWithOptions(
      {
        title: `Hej, ${name}`,
        options: ['Logga ut', 'Avbryt'],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          dispatch(logOut());
        }
      }
    );
  };
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
